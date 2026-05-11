import type { Schedule, ScheduleCreate, ScheduleUpdate } from './model';
import { ScheduleRepository, ScheduleNotFoundError } from './repository';
import { validateScheduleCreate, validateScheduleUpdate } from './validator';

export interface ScheduleServiceDeps {
  repository: ScheduleRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListScheduleOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Schedule;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ScheduleRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ScheduleService {
  private readonly repo: ScheduleRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ScheduleServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ScheduleCreate): Schedule {
    const errors = validateScheduleCreate(input);
    if (errors.length > 0) throw new ScheduleValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ScheduleService.create', { id: created.id });
    return created;
  }

  get(id: string): Schedule {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ScheduleNotFoundError) throw err;
      throw new ScheduleServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Schedule | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ScheduleUpdate): Schedule {
    const errors = validateScheduleUpdate(patch);
    if (errors.length > 0) throw new ScheduleValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ScheduleService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ScheduleNotFoundError(id);
    this.logger('ScheduleService.delete', { id });
  }

  list(options: ListScheduleOptions = {}): Schedule[] {
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

  batchCreate(inputs: ScheduleCreate[]): Schedule[] {
    for (const input of inputs) {
      const errors = validateScheduleCreate(input);
      if (errors.length > 0) throw new ScheduleValidationError(errors);
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

  searchByField<K extends keyof Schedule>(field: K, value: Schedule[K]): Schedule[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ScheduleServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduleServiceError';
  }
}

export class ScheduleValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Schedule validation failed: ${errors.join('; ')}`);
    this.name = 'ScheduleValidationError';
  }
}
