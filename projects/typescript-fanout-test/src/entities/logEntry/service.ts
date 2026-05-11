import type { LogEntry, LogEntryCreate, LogEntryUpdate } from './model';
import { LogEntryRepository, LogEntryNotFoundError } from './repository';
import { validateLogEntryCreate, validateLogEntryUpdate } from './validator';

export interface LogEntryServiceDeps {
  repository: LogEntryRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListLogEntryOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof LogEntry;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above LogEntryRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class LogEntryService {
  private readonly repo: LogEntryRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: LogEntryServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: LogEntryCreate): LogEntry {
    const errors = validateLogEntryCreate(input);
    if (errors.length > 0) throw new LogEntryValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('LogEntryService.create', { id: created.id });
    return created;
  }

  get(id: string): LogEntry {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof LogEntryNotFoundError) throw err;
      throw new LogEntryServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): LogEntry | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: LogEntryUpdate): LogEntry {
    const errors = validateLogEntryUpdate(patch);
    if (errors.length > 0) throw new LogEntryValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('LogEntryService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new LogEntryNotFoundError(id);
    this.logger('LogEntryService.delete', { id });
  }

  list(options: ListLogEntryOptions = {}): LogEntry[] {
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

  batchCreate(inputs: LogEntryCreate[]): LogEntry[] {
    for (const input of inputs) {
      const errors = validateLogEntryCreate(input);
      if (errors.length > 0) throw new LogEntryValidationError(errors);
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

  searchByField<K extends keyof LogEntry>(field: K, value: LogEntry[K]): LogEntry[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class LogEntryServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogEntryServiceError';
  }
}

export class LogEntryValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`LogEntry validation failed: ${errors.join('; ')}`);
    this.name = 'LogEntryValidationError';
  }
}
