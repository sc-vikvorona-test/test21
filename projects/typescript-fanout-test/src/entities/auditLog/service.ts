import type { AuditLog, AuditLogCreate, AuditLogUpdate } from './model';
import { AuditLogRepository, AuditLogNotFoundError } from './repository';
import { validateAuditLogCreate, validateAuditLogUpdate } from './validator';

export interface AuditLogServiceDeps {
  repository: AuditLogRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListAuditLogOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof AuditLog;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above AuditLogRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class AuditLogService {
  private readonly repo: AuditLogRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: AuditLogServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: AuditLogCreate): AuditLog {
    const errors = validateAuditLogCreate(input);
    if (errors.length > 0) throw new AuditLogValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('AuditLogService.create', { id: created.id });
    return created;
  }

  get(id: string): AuditLog {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof AuditLogNotFoundError) throw err;
      throw new AuditLogServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): AuditLog | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: AuditLogUpdate): AuditLog {
    const errors = validateAuditLogUpdate(patch);
    if (errors.length > 0) throw new AuditLogValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('AuditLogService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new AuditLogNotFoundError(id);
    this.logger('AuditLogService.delete', { id });
  }

  list(options: ListAuditLogOptions = {}): AuditLog[] {
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

  batchCreate(inputs: AuditLogCreate[]): AuditLog[] {
    for (const input of inputs) {
      const errors = validateAuditLogCreate(input);
      if (errors.length > 0) throw new AuditLogValidationError(errors);
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

  searchByField<K extends keyof AuditLog>(field: K, value: AuditLog[K]): AuditLog[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class AuditLogServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuditLogServiceError';
  }
}

export class AuditLogValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`AuditLog validation failed: ${errors.join('; ')}`);
    this.name = 'AuditLogValidationError';
  }
}
