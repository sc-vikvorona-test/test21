import type { Comment, CommentCreate, CommentUpdate } from './model';
import { CommentRepository, CommentNotFoundError } from './repository';
import { validateCommentCreate, validateCommentUpdate } from './validator';

export interface CommentServiceDeps {
  repository: CommentRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListCommentOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Comment;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above CommentRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class CommentService {
  private readonly repo: CommentRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: CommentServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: CommentCreate): Comment {
    const errors = validateCommentCreate(input);
    if (errors.length > 0) throw new CommentValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('CommentService.create', { id: created.id });
    return created;
  }

  get(id: string): Comment {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof CommentNotFoundError) throw err;
      throw new CommentServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Comment | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: CommentUpdate): Comment {
    const errors = validateCommentUpdate(patch);
    if (errors.length > 0) throw new CommentValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('CommentService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new CommentNotFoundError(id);
    this.logger('CommentService.delete', { id });
  }

  list(options: ListCommentOptions = {}): Comment[] {
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

  batchCreate(inputs: CommentCreate[]): Comment[] {
    for (const input of inputs) {
      const errors = validateCommentCreate(input);
      if (errors.length > 0) throw new CommentValidationError(errors);
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

  searchByField<K extends keyof Comment>(field: K, value: Comment[K]): Comment[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class CommentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentServiceError';
  }
}

export class CommentValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Comment validation failed: ${errors.join('; ')}`);
    this.name = 'CommentValidationError';
  }
}
