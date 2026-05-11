import type { Secret, SecretCreate, SecretUpdate } from './model';
import { SecretRepository, SecretNotFoundError } from './repository';
import { validateSecretCreate, validateSecretUpdate } from './validator';

export interface SecretServiceDeps {
  repository: SecretRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListSecretOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Secret;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above SecretRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class SecretService {
  private readonly repo: SecretRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: SecretServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: SecretCreate): Secret {
    const errors = validateSecretCreate(input);
    if (errors.length > 0) throw new SecretValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('SecretService.create', { id: created.id });
    return created;
  }

  get(id: string): Secret {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof SecretNotFoundError) throw err;
      throw new SecretServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Secret | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: SecretUpdate): Secret {
    const errors = validateSecretUpdate(patch);
    if (errors.length > 0) throw new SecretValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('SecretService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new SecretNotFoundError(id);
    this.logger('SecretService.delete', { id });
  }

  list(options: ListSecretOptions = {}): Secret[] {
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

  batchCreate(inputs: SecretCreate[]): Secret[] {
    for (const input of inputs) {
      const errors = validateSecretCreate(input);
      if (errors.length > 0) throw new SecretValidationError(errors);
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

  searchByField<K extends keyof Secret>(field: K, value: Secret[K]): Secret[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class SecretServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretServiceError';
  }
}

export class SecretValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Secret validation failed: ${errors.join('; ')}`);
    this.name = 'SecretValidationError';
  }
}
