import type { Mention, MentionCreate, MentionUpdate } from './model';
import { MentionRepository, MentionNotFoundError } from './repository';
import { validateMentionCreate, validateMentionUpdate } from './validator';

export interface MentionServiceDeps {
  repository: MentionRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListMentionOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Mention;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above MentionRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class MentionService {
  private readonly repo: MentionRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: MentionServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: MentionCreate): Mention {
    const errors = validateMentionCreate(input);
    if (errors.length > 0) throw new MentionValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('MentionService.create', { id: created.id });
    return created;
  }

  get(id: string): Mention {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof MentionNotFoundError) throw err;
      throw new MentionServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Mention | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: MentionUpdate): Mention {
    const errors = validateMentionUpdate(patch);
    if (errors.length > 0) throw new MentionValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('MentionService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new MentionNotFoundError(id);
    this.logger('MentionService.delete', { id });
  }

  list(options: ListMentionOptions = {}): Mention[] {
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

  batchCreate(inputs: MentionCreate[]): Mention[] {
    for (const input of inputs) {
      const errors = validateMentionCreate(input);
      if (errors.length > 0) throw new MentionValidationError(errors);
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

  searchByField<K extends keyof Mention>(field: K, value: Mention[K]): Mention[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class MentionServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MentionServiceError';
  }
}

export class MentionValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Mention validation failed: ${errors.join('; ')}`);
    this.name = 'MentionValidationError';
  }
}
