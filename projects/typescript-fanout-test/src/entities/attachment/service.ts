import type { Attachment, AttachmentCreate, AttachmentUpdate } from './model';
import { AttachmentRepository, AttachmentNotFoundError } from './repository';
import { validateAttachmentCreate, validateAttachmentUpdate } from './validator';

export interface AttachmentServiceDeps {
  repository: AttachmentRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListAttachmentOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Attachment;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above AttachmentRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class AttachmentService {
  private readonly repo: AttachmentRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: AttachmentServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: AttachmentCreate): Attachment {
    const errors = validateAttachmentCreate(input);
    if (errors.length > 0) throw new AttachmentValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('AttachmentService.create', { id: created.id });
    return created;
  }

  get(id: string): Attachment {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof AttachmentNotFoundError) throw err;
      throw new AttachmentServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Attachment | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: AttachmentUpdate): Attachment {
    const errors = validateAttachmentUpdate(patch);
    if (errors.length > 0) throw new AttachmentValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('AttachmentService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new AttachmentNotFoundError(id);
    this.logger('AttachmentService.delete', { id });
  }

  list(options: ListAttachmentOptions = {}): Attachment[] {
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

  batchCreate(inputs: AttachmentCreate[]): Attachment[] {
    for (const input of inputs) {
      const errors = validateAttachmentCreate(input);
      if (errors.length > 0) throw new AttachmentValidationError(errors);
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

  searchByField<K extends keyof Attachment>(field: K, value: Attachment[K]): Attachment[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class AttachmentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AttachmentServiceError';
  }
}

export class AttachmentValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Attachment validation failed: ${errors.join('; ')}`);
    this.name = 'AttachmentValidationError';
  }
}
