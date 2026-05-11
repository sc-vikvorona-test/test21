import type { BillingAccount, BillingAccountCreate, BillingAccountUpdate } from './model';
import { BillingAccountRepository, BillingAccountNotFoundError } from './repository';
import { validateBillingAccountCreate, validateBillingAccountUpdate } from './validator';

export interface BillingAccountServiceDeps {
  repository: BillingAccountRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListBillingAccountOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof BillingAccount;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above BillingAccountRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class BillingAccountService {
  private readonly repo: BillingAccountRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: BillingAccountServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: BillingAccountCreate): BillingAccount {
    const errors = validateBillingAccountCreate(input);
    if (errors.length > 0) throw new BillingAccountValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('BillingAccountService.create', { id: created.id });
    return created;
  }

  get(id: string): BillingAccount {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof BillingAccountNotFoundError) throw err;
      throw new BillingAccountServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): BillingAccount | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: BillingAccountUpdate): BillingAccount {
    const errors = validateBillingAccountUpdate(patch);
    if (errors.length > 0) throw new BillingAccountValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('BillingAccountService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new BillingAccountNotFoundError(id);
    this.logger('BillingAccountService.delete', { id });
  }

  list(options: ListBillingAccountOptions = {}): BillingAccount[] {
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

  batchCreate(inputs: BillingAccountCreate[]): BillingAccount[] {
    for (const input of inputs) {
      const errors = validateBillingAccountCreate(input);
      if (errors.length > 0) throw new BillingAccountValidationError(errors);
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

  searchByField<K extends keyof BillingAccount>(field: K, value: BillingAccount[K]): BillingAccount[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class BillingAccountServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BillingAccountServiceError';
  }
}

export class BillingAccountValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`BillingAccount validation failed: ${errors.join('; ')}`);
    this.name = 'BillingAccountValidationError';
  }
}
