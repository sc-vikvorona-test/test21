import type { Snapshot, SnapshotCreate, SnapshotUpdate } from './model';
import { SnapshotRepository, SnapshotNotFoundError } from './repository';
import { validateSnapshotCreate, validateSnapshotUpdate } from './validator';

export interface SnapshotServiceDeps {
  repository: SnapshotRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListSnapshotOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Snapshot;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above SnapshotRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class SnapshotService {
  private readonly repo: SnapshotRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: SnapshotServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: SnapshotCreate): Snapshot {
    const errors = validateSnapshotCreate(input);
    if (errors.length > 0) throw new SnapshotValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('SnapshotService.create', { id: created.id });
    return created;
  }

  get(id: string): Snapshot {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof SnapshotNotFoundError) throw err;
      throw new SnapshotServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Snapshot | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: SnapshotUpdate): Snapshot {
    const errors = validateSnapshotUpdate(patch);
    if (errors.length > 0) throw new SnapshotValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('SnapshotService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new SnapshotNotFoundError(id);
    this.logger('SnapshotService.delete', { id });
  }

  list(options: ListSnapshotOptions = {}): Snapshot[] {
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

  batchCreate(inputs: SnapshotCreate[]): Snapshot[] {
    for (const input of inputs) {
      const errors = validateSnapshotCreate(input);
      if (errors.length > 0) throw new SnapshotValidationError(errors);
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

  searchByField<K extends keyof Snapshot>(field: K, value: Snapshot[K]): Snapshot[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class SnapshotServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SnapshotServiceError';
  }
}

export class SnapshotValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Snapshot validation failed: ${errors.join('; ')}`);
    this.name = 'SnapshotValidationError';
  }
}
