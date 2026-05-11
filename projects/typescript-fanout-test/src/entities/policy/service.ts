import type { Policy, PolicyCreate, PolicyUpdate } from './model';
import { PolicyRepository, PolicyNotFoundError } from './repository';
import { validatePolicyCreate, validatePolicyUpdate } from './validator';

export interface PolicyServiceDeps {
  repository: PolicyRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListPolicyOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Policy;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above PolicyRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class PolicyService {
  private readonly repo: PolicyRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: PolicyServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: PolicyCreate): Policy {
    const errors = validatePolicyCreate(input);
    if (errors.length > 0) throw new PolicyValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('PolicyService.create', { id: created.id });
    return created;
  }

  get(id: string): Policy {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof PolicyNotFoundError) throw err;
      throw new PolicyServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Policy | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: PolicyUpdate): Policy {
    const errors = validatePolicyUpdate(patch);
    if (errors.length > 0) throw new PolicyValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('PolicyService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new PolicyNotFoundError(id);
    this.logger('PolicyService.delete', { id });
  }

  list(options: ListPolicyOptions = {}): Policy[] {
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

  batchCreate(inputs: PolicyCreate[]): Policy[] {
    for (const input of inputs) {
      const errors = validatePolicyCreate(input);
      if (errors.length > 0) throw new PolicyValidationError(errors);
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

  searchByField<K extends keyof Policy>(field: K, value: Policy[K]): Policy[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class PolicyServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyServiceError';
  }
}

export class PolicyValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Policy validation failed: ${errors.join('; ')}`);
    this.name = 'PolicyValidationError';
  }
}
