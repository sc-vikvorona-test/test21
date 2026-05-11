import type { Webhook, WebhookCreate, WebhookUpdate } from './model';
import { WebhookRepository, WebhookNotFoundError } from './repository';
import { validateWebhookCreate, validateWebhookUpdate } from './validator';

export interface WebhookServiceDeps {
  repository: WebhookRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListWebhookOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Webhook;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above WebhookRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class WebhookService {
  private readonly repo: WebhookRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: WebhookServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: WebhookCreate): Webhook {
    const errors = validateWebhookCreate(input);
    if (errors.length > 0) throw new WebhookValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('WebhookService.create', { id: created.id });
    return created;
  }

  get(id: string): Webhook {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof WebhookNotFoundError) throw err;
      throw new WebhookServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Webhook | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: WebhookUpdate): Webhook {
    const errors = validateWebhookUpdate(patch);
    if (errors.length > 0) throw new WebhookValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('WebhookService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new WebhookNotFoundError(id);
    this.logger('WebhookService.delete', { id });
  }

  list(options: ListWebhookOptions = {}): Webhook[] {
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

  batchCreate(inputs: WebhookCreate[]): Webhook[] {
    for (const input of inputs) {
      const errors = validateWebhookCreate(input);
      if (errors.length > 0) throw new WebhookValidationError(errors);
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

  searchByField<K extends keyof Webhook>(field: K, value: Webhook[K]): Webhook[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class WebhookServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookServiceError';
  }
}

export class WebhookValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Webhook validation failed: ${errors.join('; ')}`);
    this.name = 'WebhookValidationError';
  }
}
