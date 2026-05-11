import type { Tag, TagCreate, TagUpdate } from './model';
import { TagRepository, TagNotFoundError } from './repository';
import { validateTagCreate, validateTagUpdate } from './validator';

export interface TagServiceDeps {
  repository: TagRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListTagOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Tag;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above TagRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class TagService {
  private readonly repo: TagRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: TagServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: TagCreate): Tag {
    const errors = validateTagCreate(input);
    if (errors.length > 0) throw new TagValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('TagService.create', { id: created.id });
    return created;
  }

  get(id: string): Tag {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof TagNotFoundError) throw err;
      throw new TagServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Tag | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: TagUpdate): Tag {
    const errors = validateTagUpdate(patch);
    if (errors.length > 0) throw new TagValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('TagService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new TagNotFoundError(id);
    this.logger('TagService.delete', { id });
  }

  list(options: ListTagOptions = {}): Tag[] {
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

  batchCreate(inputs: TagCreate[]): Tag[] {
    for (const input of inputs) {
      const errors = validateTagCreate(input);
      if (errors.length > 0) throw new TagValidationError(errors);
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

  searchByField<K extends keyof Tag>(field: K, value: Tag[K]): Tag[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class TagServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TagServiceError';
  }
}

export class TagValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Tag validation failed: ${errors.join('; ')}`);
    this.name = 'TagValidationError';
  }
}
