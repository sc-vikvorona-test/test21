import type { Thread, ThreadCreate, ThreadUpdate } from './model';
import { ThreadRepository, ThreadNotFoundError } from './repository';
import { validateThreadCreate, validateThreadUpdate } from './validator';

export interface ThreadServiceDeps {
  repository: ThreadRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListThreadOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Thread;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ThreadRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ThreadService {
  private readonly repo: ThreadRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ThreadServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ThreadCreate): Thread {
    const errors = validateThreadCreate(input);
    if (errors.length > 0) throw new ThreadValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ThreadService.create', { id: created.id });
    return created;
  }

  get(id: string): Thread {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ThreadNotFoundError) throw err;
      throw new ThreadServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Thread | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ThreadUpdate): Thread {
    const errors = validateThreadUpdate(patch);
    if (errors.length > 0) throw new ThreadValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ThreadService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ThreadNotFoundError(id);
    this.logger('ThreadService.delete', { id });
  }

  list(options: ListThreadOptions = {}): Thread[] {
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

  batchCreate(inputs: ThreadCreate[]): Thread[] {
    for (const input of inputs) {
      const errors = validateThreadCreate(input);
      if (errors.length > 0) throw new ThreadValidationError(errors);
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

  searchByField<K extends keyof Thread>(field: K, value: Thread[K]): Thread[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ThreadServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreadServiceError';
  }
}

export class ThreadValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Thread validation failed: ${errors.join('; ')}`);
    this.name = 'ThreadValidationError';
  }
}
