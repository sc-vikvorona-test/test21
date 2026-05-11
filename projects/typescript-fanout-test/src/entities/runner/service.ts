import type { Runner, RunnerCreate, RunnerUpdate } from './model';
import { RunnerRepository, RunnerNotFoundError } from './repository';
import { validateRunnerCreate, validateRunnerUpdate } from './validator';

export interface RunnerServiceDeps {
  repository: RunnerRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListRunnerOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Runner;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above RunnerRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class RunnerService {
  private readonly repo: RunnerRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: RunnerServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: RunnerCreate): Runner {
    const errors = validateRunnerCreate(input);
    if (errors.length > 0) throw new RunnerValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('RunnerService.create', { id: created.id });
    return created;
  }

  get(id: string): Runner {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof RunnerNotFoundError) throw err;
      throw new RunnerServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Runner | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: RunnerUpdate): Runner {
    const errors = validateRunnerUpdate(patch);
    if (errors.length > 0) throw new RunnerValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('RunnerService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new RunnerNotFoundError(id);
    this.logger('RunnerService.delete', { id });
  }

  list(options: ListRunnerOptions = {}): Runner[] {
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

  batchCreate(inputs: RunnerCreate[]): Runner[] {
    for (const input of inputs) {
      const errors = validateRunnerCreate(input);
      if (errors.length > 0) throw new RunnerValidationError(errors);
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

  searchByField<K extends keyof Runner>(field: K, value: Runner[K]): Runner[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class RunnerServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RunnerServiceError';
  }
}

export class RunnerValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Runner validation failed: ${errors.join('; ')}`);
    this.name = 'RunnerValidationError';
  }
}
