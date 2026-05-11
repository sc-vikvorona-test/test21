import type { Pipeline, PipelineCreate, PipelineUpdate } from './model';
import { PipelineRepository, PipelineNotFoundError } from './repository';
import { validatePipelineCreate, validatePipelineUpdate } from './validator';

export interface PipelineServiceDeps {
  repository: PipelineRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListPipelineOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Pipeline;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above PipelineRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class PipelineService {
  private readonly repo: PipelineRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: PipelineServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: PipelineCreate): Pipeline {
    const errors = validatePipelineCreate(input);
    if (errors.length > 0) throw new PipelineValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('PipelineService.create', { id: created.id });
    return created;
  }

  get(id: string): Pipeline {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof PipelineNotFoundError) throw err;
      throw new PipelineServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Pipeline | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: PipelineUpdate): Pipeline {
    const errors = validatePipelineUpdate(patch);
    if (errors.length > 0) throw new PipelineValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('PipelineService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new PipelineNotFoundError(id);
    this.logger('PipelineService.delete', { id });
  }

  list(options: ListPipelineOptions = {}): Pipeline[] {
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

  batchCreate(inputs: PipelineCreate[]): Pipeline[] {
    for (const input of inputs) {
      const errors = validatePipelineCreate(input);
      if (errors.length > 0) throw new PipelineValidationError(errors);
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

  searchByField<K extends keyof Pipeline>(field: K, value: Pipeline[K]): Pipeline[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class PipelineServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PipelineServiceError';
  }
}

export class PipelineValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Pipeline validation failed: ${errors.join('; ')}`);
    this.name = 'PipelineValidationError';
  }
}
