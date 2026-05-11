import type { Repository, RepositoryCreate, RepositoryUpdate } from './model';
import { RepositoryRepository, RepositoryNotFoundError } from './repository';
import { validateRepositoryCreate, validateRepositoryUpdate } from './validator';

export interface RepositoryServiceDeps {
  repository: RepositoryRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListRepositoryOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Repository;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above RepositoryRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class RepositoryService {
  private readonly repo: RepositoryRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: RepositoryServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: RepositoryCreate): Repository {
    const errors = validateRepositoryCreate(input);
    if (errors.length > 0) throw new RepositoryValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('RepositoryService.create', { id: created.id });
    return created;
  }

  get(id: string): Repository {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof RepositoryNotFoundError) throw err;
      throw new RepositoryServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Repository | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: RepositoryUpdate): Repository {
    const errors = validateRepositoryUpdate(patch);
    if (errors.length > 0) throw new RepositoryValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('RepositoryService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new RepositoryNotFoundError(id);
    this.logger('RepositoryService.delete', { id });
  }

  list(options: ListRepositoryOptions = {}): Repository[] {
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

  batchCreate(inputs: RepositoryCreate[]): Repository[] {
    for (const input of inputs) {
      const errors = validateRepositoryCreate(input);
      if (errors.length > 0) throw new RepositoryValidationError(errors);
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

  searchByField<K extends keyof Repository>(field: K, value: Repository[K]): Repository[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class RepositoryServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryServiceError';
  }
}

export class RepositoryValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Repository validation failed: ${errors.join('; ')}`);
    this.name = 'RepositoryValidationError';
  }
}
