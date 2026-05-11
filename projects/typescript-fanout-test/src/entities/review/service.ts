import type { Review, ReviewCreate, ReviewUpdate } from './model';
import { ReviewRepository, ReviewNotFoundError } from './repository';
import { validateReviewCreate, validateReviewUpdate } from './validator';

export interface ReviewServiceDeps {
  repository: ReviewRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListReviewOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Review;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ReviewRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ReviewService {
  private readonly repo: ReviewRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ReviewServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ReviewCreate): Review {
    const errors = validateReviewCreate(input);
    if (errors.length > 0) throw new ReviewValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ReviewService.create', { id: created.id });
    return created;
  }

  get(id: string): Review {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ReviewNotFoundError) throw err;
      throw new ReviewServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Review | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ReviewUpdate): Review {
    const errors = validateReviewUpdate(patch);
    if (errors.length > 0) throw new ReviewValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ReviewService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ReviewNotFoundError(id);
    this.logger('ReviewService.delete', { id });
  }

  list(options: ListReviewOptions = {}): Review[] {
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

  batchCreate(inputs: ReviewCreate[]): Review[] {
    for (const input of inputs) {
      const errors = validateReviewCreate(input);
      if (errors.length > 0) throw new ReviewValidationError(errors);
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

  searchByField<K extends keyof Review>(field: K, value: Review[K]): Review[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ReviewServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReviewServiceError';
  }
}

export class ReviewValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Review validation failed: ${errors.join('; ')}`);
    this.name = 'ReviewValidationError';
  }
}
