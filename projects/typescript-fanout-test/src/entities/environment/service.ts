import type { Environment, EnvironmentCreate, EnvironmentUpdate } from './model';
import { EnvironmentRepository, EnvironmentNotFoundError } from './repository';
import { validateEnvironmentCreate, validateEnvironmentUpdate } from './validator';

export interface EnvironmentServiceDeps {
  repository: EnvironmentRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListEnvironmentOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Environment;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above EnvironmentRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class EnvironmentService {
  private readonly repo: EnvironmentRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: EnvironmentServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: EnvironmentCreate): Environment {
    const errors = validateEnvironmentCreate(input);
    if (errors.length > 0) throw new EnvironmentValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('EnvironmentService.create', { id: created.id });
    return created;
  }

  get(id: string): Environment {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof EnvironmentNotFoundError) throw err;
      throw new EnvironmentServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Environment | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: EnvironmentUpdate): Environment {
    const errors = validateEnvironmentUpdate(patch);
    if (errors.length > 0) throw new EnvironmentValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('EnvironmentService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new EnvironmentNotFoundError(id);
    this.logger('EnvironmentService.delete', { id });
  }

  list(options: ListEnvironmentOptions = {}): Environment[] {
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

  batchCreate(inputs: EnvironmentCreate[]): Environment[] {
    for (const input of inputs) {
      const errors = validateEnvironmentCreate(input);
      if (errors.length > 0) throw new EnvironmentValidationError(errors);
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

  searchByField<K extends keyof Environment>(field: K, value: Environment[K]): Environment[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class EnvironmentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentServiceError';
  }
}

export class EnvironmentValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Environment validation failed: ${errors.join('; ')}`);
    this.name = 'EnvironmentValidationError';
  }
}
