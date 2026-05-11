import type { CacheEntry, CacheEntryCreate, CacheEntryUpdate } from './model';
import { CacheEntryRepository, CacheEntryNotFoundError } from './repository';
import { validateCacheEntryCreate, validateCacheEntryUpdate } from './validator';

export interface CacheEntryServiceDeps {
  repository: CacheEntryRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListCacheEntryOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof CacheEntry;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above CacheEntryRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class CacheEntryService {
  private readonly repo: CacheEntryRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: CacheEntryServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: CacheEntryCreate): CacheEntry {
    const errors = validateCacheEntryCreate(input);
    if (errors.length > 0) throw new CacheEntryValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('CacheEntryService.create', { id: created.id });
    return created;
  }

  get(id: string): CacheEntry {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof CacheEntryNotFoundError) throw err;
      throw new CacheEntryServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): CacheEntry | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: CacheEntryUpdate): CacheEntry {
    const errors = validateCacheEntryUpdate(patch);
    if (errors.length > 0) throw new CacheEntryValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('CacheEntryService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new CacheEntryNotFoundError(id);
    this.logger('CacheEntryService.delete', { id });
  }

  list(options: ListCacheEntryOptions = {}): CacheEntry[] {
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

  batchCreate(inputs: CacheEntryCreate[]): CacheEntry[] {
    for (const input of inputs) {
      const errors = validateCacheEntryCreate(input);
      if (errors.length > 0) throw new CacheEntryValidationError(errors);
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

  searchByField<K extends keyof CacheEntry>(field: K, value: CacheEntry[K]): CacheEntry[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class CacheEntryServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheEntryServiceError';
  }
}

export class CacheEntryValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`CacheEntry validation failed: ${errors.join('; ')}`);
    this.name = 'CacheEntryValidationError';
  }
}
