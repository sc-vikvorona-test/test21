import type { User, UserCreate, UserUpdate } from './model';
import { UserRepository, UserNotFoundError } from './repository';
import { validateUserCreate, validateUserUpdate } from './validator';

export interface UserServiceDeps {
  repository: UserRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListUserOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof User;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above UserRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class UserService {
  private readonly repo: UserRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: UserServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: UserCreate): User {
    const errors = validateUserCreate(input);
    if (errors.length > 0) throw new UserValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('UserService.create', { id: created.id });
    return created;
  }

  get(id: string): User {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof UserNotFoundError) throw err;
      throw new UserServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): User | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: UserUpdate): User {
    const errors = validateUserUpdate(patch);
    if (errors.length > 0) throw new UserValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('UserService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new UserNotFoundError(id);
    this.logger('UserService.delete', { id });
  }

  list(options: ListUserOptions = {}): User[] {
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

  batchCreate(inputs: UserCreate[]): User[] {
    for (const input of inputs) {
      const errors = validateUserCreate(input);
      if (errors.length > 0) throw new UserValidationError(errors);
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

  searchByField<K extends keyof User>(field: K, value: User[K]): User[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export class UserValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`User validation failed: ${errors.join('; ')}`);
    this.name = 'UserValidationError';
  }
}
