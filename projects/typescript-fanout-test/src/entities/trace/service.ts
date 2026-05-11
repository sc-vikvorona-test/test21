import type { Trace, TraceCreate, TraceUpdate } from './model';
import { TraceRepository, TraceNotFoundError } from './repository';
import { validateTraceCreate, validateTraceUpdate } from './validator';

export interface TraceServiceDeps {
  repository: TraceRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListTraceOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Trace;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above TraceRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class TraceService {
  private readonly repo: TraceRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: TraceServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: TraceCreate): Trace {
    const errors = validateTraceCreate(input);
    if (errors.length > 0) throw new TraceValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('TraceService.create', { id: created.id });
    return created;
  }

  get(id: string): Trace {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof TraceNotFoundError) throw err;
      throw new TraceServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Trace | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: TraceUpdate): Trace {
    const errors = validateTraceUpdate(patch);
    if (errors.length > 0) throw new TraceValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('TraceService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new TraceNotFoundError(id);
    this.logger('TraceService.delete', { id });
  }

  list(options: ListTraceOptions = {}): Trace[] {
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

  batchCreate(inputs: TraceCreate[]): Trace[] {
    for (const input of inputs) {
      const errors = validateTraceCreate(input);
      if (errors.length > 0) throw new TraceValidationError(errors);
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

  searchByField<K extends keyof Trace>(field: K, value: Trace[K]): Trace[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class TraceServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TraceServiceError';
  }
}

export class TraceValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Trace validation failed: ${errors.join('; ')}`);
    this.name = 'TraceValidationError';
  }
}
