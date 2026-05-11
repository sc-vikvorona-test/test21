import type { Invitation, InvitationCreate, InvitationUpdate } from './model';
import { InvitationRepository, InvitationNotFoundError } from './repository';
import { validateInvitationCreate, validateInvitationUpdate } from './validator';

export interface InvitationServiceDeps {
  repository: InvitationRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListInvitationOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Invitation;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above InvitationRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class InvitationService {
  private readonly repo: InvitationRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: InvitationServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: InvitationCreate): Invitation {
    const errors = validateInvitationCreate(input);
    if (errors.length > 0) throw new InvitationValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('InvitationService.create', { id: created.id });
    return created;
  }

  get(id: string): Invitation {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof InvitationNotFoundError) throw err;
      throw new InvitationServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Invitation | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: InvitationUpdate): Invitation {
    const errors = validateInvitationUpdate(patch);
    if (errors.length > 0) throw new InvitationValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('InvitationService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new InvitationNotFoundError(id);
    this.logger('InvitationService.delete', { id });
  }

  list(options: ListInvitationOptions = {}): Invitation[] {
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

  batchCreate(inputs: InvitationCreate[]): Invitation[] {
    for (const input of inputs) {
      const errors = validateInvitationCreate(input);
      if (errors.length > 0) throw new InvitationValidationError(errors);
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

  searchByField<K extends keyof Invitation>(field: K, value: Invitation[K]): Invitation[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class InvitationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvitationServiceError';
  }
}

export class InvitationValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Invitation validation failed: ${errors.join('; ')}`);
    this.name = 'InvitationValidationError';
  }
}
