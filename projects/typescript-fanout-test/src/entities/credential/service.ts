import type { Credential, CredentialCreate, CredentialUpdate } from './model';
import { CredentialRepository, CredentialNotFoundError } from './repository';
import { validateCredentialCreate, validateCredentialUpdate } from './validator';

export interface CredentialServiceDeps {
  repository: CredentialRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListCredentialOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Credential;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above CredentialRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class CredentialService {
  private readonly repo: CredentialRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: CredentialServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: CredentialCreate): Credential {
    const errors = validateCredentialCreate(input);
    if (errors.length > 0) throw new CredentialValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('CredentialService.create', { id: created.id });
    return created;
  }

  get(id: string): Credential {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof CredentialNotFoundError) throw err;
      throw new CredentialServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Credential | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: CredentialUpdate): Credential {
    const errors = validateCredentialUpdate(patch);
    if (errors.length > 0) throw new CredentialValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('CredentialService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new CredentialNotFoundError(id);
    this.logger('CredentialService.delete', { id });
  }

  list(options: ListCredentialOptions = {}): Credential[] {
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

  batchCreate(inputs: CredentialCreate[]): Credential[] {
    for (const input of inputs) {
      const errors = validateCredentialCreate(input);
      if (errors.length > 0) throw new CredentialValidationError(errors);
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

  searchByField<K extends keyof Credential>(field: K, value: Credential[K]): Credential[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class CredentialServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CredentialServiceError';
  }
}

export class CredentialValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Credential validation failed: ${errors.join('; ')}`);
    this.name = 'CredentialValidationError';
  }
}
