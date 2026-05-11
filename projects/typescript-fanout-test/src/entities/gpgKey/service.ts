import type { GpgKey, GpgKeyCreate, GpgKeyUpdate } from './model';
import { GpgKeyRepository, GpgKeyNotFoundError } from './repository';
import { validateGpgKeyCreate, validateGpgKeyUpdate } from './validator';

export interface GpgKeyServiceDeps {
  repository: GpgKeyRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListGpgKeyOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof GpgKey;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above GpgKeyRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class GpgKeyService {
  private readonly repo: GpgKeyRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: GpgKeyServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: GpgKeyCreate): GpgKey {
    const errors = validateGpgKeyCreate(input);
    if (errors.length > 0) throw new GpgKeyValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('GpgKeyService.create', { id: created.id });
    return created;
  }

  get(id: string): GpgKey {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof GpgKeyNotFoundError) throw err;
      throw new GpgKeyServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): GpgKey | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: GpgKeyUpdate): GpgKey {
    const errors = validateGpgKeyUpdate(patch);
    if (errors.length > 0) throw new GpgKeyValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('GpgKeyService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new GpgKeyNotFoundError(id);
    this.logger('GpgKeyService.delete', { id });
  }

  list(options: ListGpgKeyOptions = {}): GpgKey[] {
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

  batchCreate(inputs: GpgKeyCreate[]): GpgKey[] {
    for (const input of inputs) {
      const errors = validateGpgKeyCreate(input);
      if (errors.length > 0) throw new GpgKeyValidationError(errors);
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

  searchByField<K extends keyof GpgKey>(field: K, value: GpgKey[K]): GpgKey[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class GpgKeyServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GpgKeyServiceError';
  }
}

export class GpgKeyValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`GpgKey validation failed: ${errors.join('; ')}`);
    this.name = 'GpgKeyValidationError';
  }
}
