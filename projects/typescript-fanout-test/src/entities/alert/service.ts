import type { Alert, AlertCreate, AlertUpdate } from './model';
import { AlertRepository, AlertNotFoundError } from './repository';
import { validateAlertCreate, validateAlertUpdate } from './validator';

export interface AlertServiceDeps {
  repository: AlertRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListAlertOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Alert;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above AlertRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class AlertService {
  private readonly repo: AlertRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: AlertServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: AlertCreate): Alert {
    const errors = validateAlertCreate(input);
    if (errors.length > 0) throw new AlertValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('AlertService.create', { id: created.id });
    return created;
  }

  get(id: string): Alert {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof AlertNotFoundError) throw err;
      throw new AlertServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Alert | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: AlertUpdate): Alert {
    const errors = validateAlertUpdate(patch);
    if (errors.length > 0) throw new AlertValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('AlertService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new AlertNotFoundError(id);
    this.logger('AlertService.delete', { id });
  }

  list(options: ListAlertOptions = {}): Alert[] {
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

  batchCreate(inputs: AlertCreate[]): Alert[] {
    for (const input of inputs) {
      const errors = validateAlertCreate(input);
      if (errors.length > 0) throw new AlertValidationError(errors);
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

  searchByField<K extends keyof Alert>(field: K, value: Alert[K]): Alert[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class AlertServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlertServiceError';
  }
}

export class AlertValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Alert validation failed: ${errors.join('; ')}`);
    this.name = 'AlertValidationError';
  }
}
