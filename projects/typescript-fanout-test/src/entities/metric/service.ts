import type { Metric, MetricCreate, MetricUpdate } from './model';
import { MetricRepository, MetricNotFoundError } from './repository';
import { validateMetricCreate, validateMetricUpdate } from './validator';

export interface MetricServiceDeps {
  repository: MetricRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListMetricOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Metric;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above MetricRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class MetricService {
  private readonly repo: MetricRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: MetricServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: MetricCreate): Metric {
    const errors = validateMetricCreate(input);
    if (errors.length > 0) throw new MetricValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('MetricService.create', { id: created.id });
    return created;
  }

  get(id: string): Metric {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof MetricNotFoundError) throw err;
      throw new MetricServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Metric | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: MetricUpdate): Metric {
    const errors = validateMetricUpdate(patch);
    if (errors.length > 0) throw new MetricValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('MetricService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new MetricNotFoundError(id);
    this.logger('MetricService.delete', { id });
  }

  list(options: ListMetricOptions = {}): Metric[] {
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 50;
    if (options.sortBy) {
      const sorted = this.repo.sortedBy(options.sortBy, options.order);
      return sorted.slice(offset, offset + limit);
    }
    return this.repo.paginate(offset, limit);
  }

  countAll(): number {
    return this.repo.count();
  }

  batchCreate(inputs: MetricCreate[]): Metric[] {
    for (const input of inputs) {
      const errors = validateMetricCreate(input);
      if (errors.length > 0) throw new MetricValidationError(errors);
    }
    return this.repo.batchInsert(inputs);
  }

  exists(id: string): boolean {
    return this.repo.findById(id) !== undefined;
  }

  /** Bulk delete with no failure semantics; safe to call with non-existent ids. */
  bulkDelete(ids: string[]): number {
    let deleted = 0;
    for (const id of ids) if (this.repo.delete(id)) deleted++;
    return deleted;
  }

  searchByField<K extends keyof Metric>(field: K, value: Metric[K]): Metric[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class MetricServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetricServiceError';
  }
}

export class MetricValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Metric validation failed: ${errors.join('; ')}`);
    this.name = 'MetricValidationError';
  }
}
