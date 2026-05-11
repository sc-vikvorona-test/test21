import type { Issue, IssueCreate, IssueUpdate } from './model';
import { IssueRepository, IssueNotFoundError } from './repository';
import { validateIssueCreate, validateIssueUpdate } from './validator';

export interface IssueServiceDeps {
  repository: IssueRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListIssueOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Issue;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above IssueRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class IssueService {
  private readonly repo: IssueRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: IssueServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: IssueCreate): Issue {
    const errors = validateIssueCreate(input);
    if (errors.length > 0) throw new IssueValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('IssueService.create', { id: created.id });
    return created;
  }

  get(id: string): Issue {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof IssueNotFoundError) throw err;
      throw new IssueServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Issue | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: IssueUpdate): Issue {
    const errors = validateIssueUpdate(patch);
    if (errors.length > 0) throw new IssueValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('IssueService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new IssueNotFoundError(id);
    this.logger('IssueService.delete', { id });
  }

  list(options: ListIssueOptions = {}): Issue[] {
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

  batchCreate(inputs: IssueCreate[]): Issue[] {
    for (const input of inputs) {
      const errors = validateIssueCreate(input);
      if (errors.length > 0) throw new IssueValidationError(errors);
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

  searchByField<K extends keyof Issue>(field: K, value: Issue[K]): Issue[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class IssueServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IssueServiceError';
  }
}

export class IssueValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Issue validation failed: ${errors.join('; ')}`);
    this.name = 'IssueValidationError';
  }
}
