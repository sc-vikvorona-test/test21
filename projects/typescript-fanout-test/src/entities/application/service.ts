import type { Application, ApplicationCreate, ApplicationUpdate } from './model';
import { ApplicationRepository, ApplicationNotFoundError } from './repository';
import { validateApplicationCreate, validateApplicationUpdate } from './validator';

export interface ApplicationServiceDeps {
  repository: ApplicationRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListApplicationOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Application;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ApplicationRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ApplicationService {
  private readonly repo: ApplicationRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ApplicationServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ApplicationCreate): Application {
    const errors = validateApplicationCreate(input);
    if (errors.length > 0) throw new ApplicationValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ApplicationService.create', { id: created.id });
    return created;
  }

  get(id: string): Application {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ApplicationNotFoundError) throw err;
      throw new ApplicationServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Application | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ApplicationUpdate): Application {
    const errors = validateApplicationUpdate(patch);
    if (errors.length > 0) throw new ApplicationValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ApplicationService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ApplicationNotFoundError(id);
    this.logger('ApplicationService.delete', { id });
  }

  list(options: ListApplicationOptions = {}): Application[] {
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

  batchCreate(inputs: ApplicationCreate[]): Application[] {
    for (const input of inputs) {
      const errors = validateApplicationCreate(input);
      if (errors.length > 0) throw new ApplicationValidationError(errors);
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

  searchByField<K extends keyof Application>(field: K, value: Application[K]): Application[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ApplicationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationServiceError';
  }
}

export class ApplicationValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Application validation failed: ${errors.join('; ')}`);
    this.name = 'ApplicationValidationError';
  }
}
