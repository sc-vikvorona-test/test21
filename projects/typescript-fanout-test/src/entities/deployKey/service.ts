import type { DeployKey, DeployKeyCreate, DeployKeyUpdate } from './model';
import { DeployKeyRepository, DeployKeyNotFoundError } from './repository';
import { validateDeployKeyCreate, validateDeployKeyUpdate } from './validator';

export interface DeployKeyServiceDeps {
  repository: DeployKeyRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListDeployKeyOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof DeployKey;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above DeployKeyRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class DeployKeyService {
  private readonly repo: DeployKeyRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: DeployKeyServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: DeployKeyCreate): DeployKey {
    const errors = validateDeployKeyCreate(input);
    if (errors.length > 0) throw new DeployKeyValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('DeployKeyService.create', { id: created.id });
    return created;
  }

  get(id: string): DeployKey {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof DeployKeyNotFoundError) throw err;
      throw new DeployKeyServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): DeployKey | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: DeployKeyUpdate): DeployKey {
    const errors = validateDeployKeyUpdate(patch);
    if (errors.length > 0) throw new DeployKeyValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('DeployKeyService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new DeployKeyNotFoundError(id);
    this.logger('DeployKeyService.delete', { id });
  }

  list(options: ListDeployKeyOptions = {}): DeployKey[] {
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

  batchCreate(inputs: DeployKeyCreate[]): DeployKey[] {
    for (const input of inputs) {
      const errors = validateDeployKeyCreate(input);
      if (errors.length > 0) throw new DeployKeyValidationError(errors);
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

  searchByField<K extends keyof DeployKey>(field: K, value: DeployKey[K]): DeployKey[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class DeployKeyServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeployKeyServiceError';
  }
}

export class DeployKeyValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`DeployKey validation failed: ${errors.join('; ')}`);
    this.name = 'DeployKeyValidationError';
  }
}
