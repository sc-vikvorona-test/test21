import type { Integration, IntegrationCreate, IntegrationUpdate } from './model';
import { IntegrationRepository, IntegrationNotFoundError } from './repository';
import { validateIntegrationCreate, validateIntegrationUpdate } from './validator';

export interface IntegrationServiceDeps {
  repository: IntegrationRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListIntegrationOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Integration;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above IntegrationRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class IntegrationService {
  private readonly repo: IntegrationRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: IntegrationServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: IntegrationCreate): Integration {
    const errors = validateIntegrationCreate(input);
    if (errors.length > 0) throw new IntegrationValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('IntegrationService.create', { id: created.id });
    return created;
  }

  get(id: string): Integration {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof IntegrationNotFoundError) throw err;
      throw new IntegrationServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Integration | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: IntegrationUpdate): Integration {
    const errors = validateIntegrationUpdate(patch);
    if (errors.length > 0) throw new IntegrationValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('IntegrationService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new IntegrationNotFoundError(id);
    this.logger('IntegrationService.delete', { id });
  }

  list(options: ListIntegrationOptions = {}): Integration[] {
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

  batchCreate(inputs: IntegrationCreate[]): Integration[] {
    for (const input of inputs) {
      const errors = validateIntegrationCreate(input);
      if (errors.length > 0) throw new IntegrationValidationError(errors);
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

  searchByField<K extends keyof Integration>(field: K, value: Integration[K]): Integration[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class IntegrationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IntegrationServiceError';
  }
}

export class IntegrationValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Integration validation failed: ${errors.join('; ')}`);
    this.name = 'IntegrationValidationError';
  }
}
