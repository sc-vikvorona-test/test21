import type { Membership, MembershipCreate, MembershipUpdate } from './model';
import { MembershipRepository, MembershipNotFoundError } from './repository';
import { validateMembershipCreate, validateMembershipUpdate } from './validator';

export interface MembershipServiceDeps {
  repository: MembershipRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListMembershipOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Membership;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above MembershipRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class MembershipService {
  private readonly repo: MembershipRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: MembershipServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: MembershipCreate): Membership {
    const errors = validateMembershipCreate(input);
    if (errors.length > 0) throw new MembershipValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('MembershipService.create', { id: created.id });
    return created;
  }

  get(id: string): Membership {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof MembershipNotFoundError) throw err;
      throw new MembershipServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Membership | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: MembershipUpdate): Membership {
    const errors = validateMembershipUpdate(patch);
    if (errors.length > 0) throw new MembershipValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('MembershipService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new MembershipNotFoundError(id);
    this.logger('MembershipService.delete', { id });
  }

  list(options: ListMembershipOptions = {}): Membership[] {
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

  batchCreate(inputs: MembershipCreate[]): Membership[] {
    for (const input of inputs) {
      const errors = validateMembershipCreate(input);
      if (errors.length > 0) throw new MembershipValidationError(errors);
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

  searchByField<K extends keyof Membership>(field: K, value: Membership[K]): Membership[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class MembershipServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MembershipServiceError';
  }
}

export class MembershipValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Membership validation failed: ${errors.join('; ')}`);
    this.name = 'MembershipValidationError';
  }
}
