import type { Project, ProjectCreate, ProjectUpdate } from './model';
import { ProjectRepository, ProjectNotFoundError } from './repository';
import { validateProjectCreate, validateProjectUpdate } from './validator';

export interface ProjectServiceDeps {
  repository: ProjectRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListProjectOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Project;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ProjectRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ProjectService {
  private readonly repo: ProjectRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ProjectServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ProjectCreate): Project {
    const errors = validateProjectCreate(input);
    if (errors.length > 0) throw new ProjectValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ProjectService.create', { id: created.id });
    return created;
  }

  get(id: string): Project {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ProjectNotFoundError) throw err;
      throw new ProjectServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Project | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ProjectUpdate): Project {
    const errors = validateProjectUpdate(patch);
    if (errors.length > 0) throw new ProjectValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ProjectService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ProjectNotFoundError(id);
    this.logger('ProjectService.delete', { id });
  }

  list(options: ListProjectOptions = {}): Project[] {
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

  batchCreate(inputs: ProjectCreate[]): Project[] {
    for (const input of inputs) {
      const errors = validateProjectCreate(input);
      if (errors.length > 0) throw new ProjectValidationError(errors);
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

  searchByField<K extends keyof Project>(field: K, value: Project[K]): Project[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ProjectServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectServiceError';
  }
}

export class ProjectValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Project validation failed: ${errors.join('; ')}`);
    this.name = 'ProjectValidationError';
  }
}
