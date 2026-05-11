import type { CronJob, CronJobCreate, CronJobUpdate } from './model';
import { CronJobRepository, CronJobNotFoundError } from './repository';
import { validateCronJobCreate, validateCronJobUpdate } from './validator';

export interface CronJobServiceDeps {
  repository: CronJobRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListCronJobOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof CronJob;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above CronJobRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class CronJobService {
  private readonly repo: CronJobRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: CronJobServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: CronJobCreate): CronJob {
    const errors = validateCronJobCreate(input);
    if (errors.length > 0) throw new CronJobValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('CronJobService.create', { id: created.id });
    return created;
  }

  get(id: string): CronJob {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof CronJobNotFoundError) throw err;
      throw new CronJobServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): CronJob | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: CronJobUpdate): CronJob {
    const errors = validateCronJobUpdate(patch);
    if (errors.length > 0) throw new CronJobValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('CronJobService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new CronJobNotFoundError(id);
    this.logger('CronJobService.delete', { id });
  }

  list(options: ListCronJobOptions = {}): CronJob[] {
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

  batchCreate(inputs: CronJobCreate[]): CronJob[] {
    for (const input of inputs) {
      const errors = validateCronJobCreate(input);
      if (errors.length > 0) throw new CronJobValidationError(errors);
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

  searchByField<K extends keyof CronJob>(field: K, value: CronJob[K]): CronJob[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class CronJobServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CronJobServiceError';
  }
}

export class CronJobValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`CronJob validation failed: ${errors.join('; ')}`);
    this.name = 'CronJobValidationError';
  }
}
