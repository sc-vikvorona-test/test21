import type { RunnerGroup, RunnerGroupCreate, RunnerGroupUpdate } from './model';
import { RunnerGroupRepository, RunnerGroupNotFoundError } from './repository';
import { validateRunnerGroupCreate, validateRunnerGroupUpdate } from './validator';

export interface RunnerGroupServiceDeps {
  repository: RunnerGroupRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListRunnerGroupOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof RunnerGroup;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above RunnerGroupRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class RunnerGroupService {
  private readonly repo: RunnerGroupRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: RunnerGroupServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: RunnerGroupCreate): RunnerGroup {
    const errors = validateRunnerGroupCreate(input);
    if (errors.length > 0) throw new RunnerGroupValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('RunnerGroupService.create', { id: created.id });
    return created;
  }

  get(id: string): RunnerGroup {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof RunnerGroupNotFoundError) throw err;
      throw new RunnerGroupServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): RunnerGroup | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: RunnerGroupUpdate): RunnerGroup {
    const errors = validateRunnerGroupUpdate(patch);
    if (errors.length > 0) throw new RunnerGroupValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('RunnerGroupService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new RunnerGroupNotFoundError(id);
    this.logger('RunnerGroupService.delete', { id });
  }

  list(options: ListRunnerGroupOptions = {}): RunnerGroup[] {
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

  batchCreate(inputs: RunnerGroupCreate[]): RunnerGroup[] {
    for (const input of inputs) {
      const errors = validateRunnerGroupCreate(input);
      if (errors.length > 0) throw new RunnerGroupValidationError(errors);
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

  searchByField<K extends keyof RunnerGroup>(field: K, value: RunnerGroup[K]): RunnerGroup[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class RunnerGroupServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RunnerGroupServiceError';
  }
}

export class RunnerGroupValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`RunnerGroup validation failed: ${errors.join('; ')}`);
    this.name = 'RunnerGroupValidationError';
  }
}
