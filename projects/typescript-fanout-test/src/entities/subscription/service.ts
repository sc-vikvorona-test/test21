import type { Subscription, SubscriptionCreate, SubscriptionUpdate } from './model';
import { SubscriptionRepository, SubscriptionNotFoundError } from './repository';
import { validateSubscriptionCreate, validateSubscriptionUpdate } from './validator';

export interface SubscriptionServiceDeps {
  repository: SubscriptionRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListSubscriptionOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Subscription;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above SubscriptionRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class SubscriptionService {
  private readonly repo: SubscriptionRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: SubscriptionServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: SubscriptionCreate): Subscription {
    const errors = validateSubscriptionCreate(input);
    if (errors.length > 0) throw new SubscriptionValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('SubscriptionService.create', { id: created.id });
    return created;
  }

  get(id: string): Subscription {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof SubscriptionNotFoundError) throw err;
      throw new SubscriptionServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Subscription | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: SubscriptionUpdate): Subscription {
    const errors = validateSubscriptionUpdate(patch);
    if (errors.length > 0) throw new SubscriptionValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('SubscriptionService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new SubscriptionNotFoundError(id);
    this.logger('SubscriptionService.delete', { id });
  }

  list(options: ListSubscriptionOptions = {}): Subscription[] {
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

  batchCreate(inputs: SubscriptionCreate[]): Subscription[] {
    for (const input of inputs) {
      const errors = validateSubscriptionCreate(input);
      if (errors.length > 0) throw new SubscriptionValidationError(errors);
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

  searchByField<K extends keyof Subscription>(field: K, value: Subscription[K]): Subscription[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class SubscriptionServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubscriptionServiceError';
  }
}

export class SubscriptionValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Subscription validation failed: ${errors.join('; ')}`);
    this.name = 'SubscriptionValidationError';
  }
}
