import type { ApiKey, ApiKeyCreate, ApiKeyUpdate } from './model';
import { ApiKeyRepository, ApiKeyNotFoundError } from './repository';
import { validateApiKeyCreate, validateApiKeyUpdate } from './validator';

export interface ApiKeyServiceDeps {
  repository: ApiKeyRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListApiKeyOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof ApiKey;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ApiKeyRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ApiKeyService {
  private readonly repo: ApiKeyRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ApiKeyServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ApiKeyCreate): ApiKey {
    const errors = validateApiKeyCreate(input);
    if (errors.length > 0) throw new ApiKeyValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ApiKeyService.create', { id: created.id });
    return created;
  }

  get(id: string): ApiKey {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ApiKeyNotFoundError) throw err;
      throw new ApiKeyServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): ApiKey | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ApiKeyUpdate): ApiKey {
    const errors = validateApiKeyUpdate(patch);
    if (errors.length > 0) throw new ApiKeyValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ApiKeyService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ApiKeyNotFoundError(id);
    this.logger('ApiKeyService.delete', { id });
  }

  list(options: ListApiKeyOptions = {}): ApiKey[] {
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

  batchCreate(inputs: ApiKeyCreate[]): ApiKey[] {
    for (const input of inputs) {
      const errors = validateApiKeyCreate(input);
      if (errors.length > 0) throw new ApiKeyValidationError(errors);
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

  searchByField<K extends keyof ApiKey>(field: K, value: ApiKey[K]): ApiKey[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ApiKeyServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyServiceError';
  }
}

export class ApiKeyValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`ApiKey validation failed: ${errors.join('; ')}`);
    this.name = 'ApiKeyValidationError';
  }
}
