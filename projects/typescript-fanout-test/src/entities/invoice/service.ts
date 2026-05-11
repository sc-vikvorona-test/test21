import type { Invoice, InvoiceCreate, InvoiceUpdate } from './model';
import { InvoiceRepository, InvoiceNotFoundError } from './repository';
import { validateInvoiceCreate, validateInvoiceUpdate } from './validator';

export interface InvoiceServiceDeps {
  repository: InvoiceRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListInvoiceOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Invoice;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above InvoiceRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class InvoiceService {
  private readonly repo: InvoiceRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: InvoiceServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: InvoiceCreate): Invoice {
    const errors = validateInvoiceCreate(input);
    if (errors.length > 0) throw new InvoiceValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('InvoiceService.create', { id: created.id });
    return created;
  }

  get(id: string): Invoice {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof InvoiceNotFoundError) throw err;
      throw new InvoiceServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Invoice | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: InvoiceUpdate): Invoice {
    const errors = validateInvoiceUpdate(patch);
    if (errors.length > 0) throw new InvoiceValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('InvoiceService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new InvoiceNotFoundError(id);
    this.logger('InvoiceService.delete', { id });
  }

  list(options: ListInvoiceOptions = {}): Invoice[] {
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

  batchCreate(inputs: InvoiceCreate[]): Invoice[] {
    for (const input of inputs) {
      const errors = validateInvoiceCreate(input);
      if (errors.length > 0) throw new InvoiceValidationError(errors);
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

  searchByField<K extends keyof Invoice>(field: K, value: Invoice[K]): Invoice[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class InvoiceServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvoiceServiceError';
  }
}

export class InvoiceValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Invoice validation failed: ${errors.join('; ')}`);
    this.name = 'InvoiceValidationError';
  }
}
