import type { Organization, OrganizationCreate, OrganizationUpdate } from './model';
import { OrganizationRepository, OrganizationNotFoundError } from './repository';
import { validateOrganizationCreate, validateOrganizationUpdate } from './validator';

export interface OrganizationServiceDeps {
  repository: OrganizationRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListOrganizationOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Organization;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above OrganizationRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class OrganizationService {
  private readonly repo: OrganizationRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: OrganizationServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: OrganizationCreate): Organization {
    const errors = validateOrganizationCreate(input);
    if (errors.length > 0) throw new OrganizationValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('OrganizationService.create', { id: created.id });
    return created;
  }

  get(id: string): Organization {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof OrganizationNotFoundError) throw err;
      throw new OrganizationServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Organization | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: OrganizationUpdate): Organization {
    const errors = validateOrganizationUpdate(patch);
    if (errors.length > 0) throw new OrganizationValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('OrganizationService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new OrganizationNotFoundError(id);
    this.logger('OrganizationService.delete', { id });
  }

  list(options: ListOrganizationOptions = {}): Organization[] {
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

  batchCreate(inputs: OrganizationCreate[]): Organization[] {
    for (const input of inputs) {
      const errors = validateOrganizationCreate(input);
      if (errors.length > 0) throw new OrganizationValidationError(errors);
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

  searchByField<K extends keyof Organization>(field: K, value: Organization[K]): Organization[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class OrganizationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrganizationServiceError';
  }
}

export class OrganizationValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Organization validation failed: ${errors.join('; ')}`);
    this.name = 'OrganizationValidationError';
  }
}
