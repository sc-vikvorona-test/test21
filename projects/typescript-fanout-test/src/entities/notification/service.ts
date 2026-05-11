import type { Notification, NotificationCreate, NotificationUpdate } from './model';
import { NotificationRepository, NotificationNotFoundError } from './repository';
import { validateNotificationCreate, validateNotificationUpdate } from './validator';

export interface NotificationServiceDeps {
  repository: NotificationRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListNotificationOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Notification;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above NotificationRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class NotificationService {
  private readonly repo: NotificationRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: NotificationServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: NotificationCreate): Notification {
    const errors = validateNotificationCreate(input);
    if (errors.length > 0) throw new NotificationValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('NotificationService.create', { id: created.id });
    return created;
  }

  get(id: string): Notification {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof NotificationNotFoundError) throw err;
      throw new NotificationServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Notification | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: NotificationUpdate): Notification {
    const errors = validateNotificationUpdate(patch);
    if (errors.length > 0) throw new NotificationValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('NotificationService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new NotificationNotFoundError(id);
    this.logger('NotificationService.delete', { id });
  }

  list(options: ListNotificationOptions = {}): Notification[] {
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

  batchCreate(inputs: NotificationCreate[]): Notification[] {
    for (const input of inputs) {
      const errors = validateNotificationCreate(input);
      if (errors.length > 0) throw new NotificationValidationError(errors);
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

  searchByField<K extends keyof Notification>(field: K, value: Notification[K]): Notification[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class NotificationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationServiceError';
  }
}

export class NotificationValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Notification validation failed: ${errors.join('; ')}`);
    this.name = 'NotificationValidationError';
  }
}
