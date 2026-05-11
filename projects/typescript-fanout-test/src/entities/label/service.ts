import type { Label, LabelCreate, LabelUpdate } from './model';
import { LabelRepository, LabelNotFoundError } from './repository';
import { validateLabelCreate, validateLabelUpdate } from './validator';

export interface LabelServiceDeps {
  repository: LabelRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListLabelOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Label;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above LabelRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class LabelService {
  private readonly repo: LabelRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: LabelServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: LabelCreate): Label {
    const errors = validateLabelCreate(input);
    if (errors.length > 0) throw new LabelValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('LabelService.create', { id: created.id });
    return created;
  }

  get(id: string): Label {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof LabelNotFoundError) throw err;
      throw new LabelServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Label | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: LabelUpdate): Label {
    const errors = validateLabelUpdate(patch);
    if (errors.length > 0) throw new LabelValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('LabelService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new LabelNotFoundError(id);
    this.logger('LabelService.delete', { id });
  }

  list(options: ListLabelOptions = {}): Label[] {
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

  batchCreate(inputs: LabelCreate[]): Label[] {
    for (const input of inputs) {
      const errors = validateLabelCreate(input);
      if (errors.length > 0) throw new LabelValidationError(errors);
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

  searchByField<K extends keyof Label>(field: K, value: Label[K]): Label[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class LabelServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LabelServiceError';
  }
}

export class LabelValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Label validation failed: ${errors.join('; ')}`);
    this.name = 'LabelValidationError';
  }
}
