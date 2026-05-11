import type { SshKey, SshKeyCreate, SshKeyUpdate } from './model';
import { SshKeyRepository, SshKeyNotFoundError } from './repository';
import { validateSshKeyCreate, validateSshKeyUpdate } from './validator';

export interface SshKeyServiceDeps {
  repository: SshKeyRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListSshKeyOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof SshKey;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above SshKeyRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class SshKeyService {
  private readonly repo: SshKeyRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: SshKeyServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: SshKeyCreate): SshKey {
    const errors = validateSshKeyCreate(input);
    if (errors.length > 0) throw new SshKeyValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('SshKeyService.create', { id: created.id });
    return created;
  }

  get(id: string): SshKey {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof SshKeyNotFoundError) throw err;
      throw new SshKeyServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): SshKey | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: SshKeyUpdate): SshKey {
    const errors = validateSshKeyUpdate(patch);
    if (errors.length > 0) throw new SshKeyValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('SshKeyService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new SshKeyNotFoundError(id);
    this.logger('SshKeyService.delete', { id });
  }

  list(options: ListSshKeyOptions = {}): SshKey[] {
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

  batchCreate(inputs: SshKeyCreate[]): SshKey[] {
    for (const input of inputs) {
      const errors = validateSshKeyCreate(input);
      if (errors.length > 0) throw new SshKeyValidationError(errors);
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

  searchByField<K extends keyof SshKey>(field: K, value: SshKey[K]): SshKey[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class SshKeyServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SshKeyServiceError';
  }
}

export class SshKeyValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`SshKey validation failed: ${errors.join('; ')}`);
    this.name = 'SshKeyValidationError';
  }
}
