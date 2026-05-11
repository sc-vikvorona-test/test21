import type { PipelineRun, PipelineRunCreate, PipelineRunUpdate } from './model';
import { PipelineRunRepository, PipelineRunNotFoundError } from './repository';
import { validatePipelineRunCreate, validatePipelineRunUpdate } from './validator';

export interface PipelineRunServiceDeps {
  repository: PipelineRunRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListPipelineRunOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof PipelineRun;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above PipelineRunRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class PipelineRunService {
  private readonly repo: PipelineRunRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: PipelineRunServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: PipelineRunCreate): PipelineRun {
    const errors = validatePipelineRunCreate(input);
    if (errors.length > 0) throw new PipelineRunValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('PipelineRunService.create', { id: created.id });
    return created;
  }

  get(id: string): PipelineRun {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof PipelineRunNotFoundError) throw err;
      throw new PipelineRunServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): PipelineRun | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: PipelineRunUpdate): PipelineRun {
    const errors = validatePipelineRunUpdate(patch);
    if (errors.length > 0) throw new PipelineRunValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('PipelineRunService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new PipelineRunNotFoundError(id);
    this.logger('PipelineRunService.delete', { id });
  }

  list(options: ListPipelineRunOptions = {}): PipelineRun[] {
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

  batchCreate(inputs: PipelineRunCreate[]): PipelineRun[] {
    for (const input of inputs) {
      const errors = validatePipelineRunCreate(input);
      if (errors.length > 0) throw new PipelineRunValidationError(errors);
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

  searchByField<K extends keyof PipelineRun>(field: K, value: PipelineRun[K]): PipelineRun[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class PipelineRunServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PipelineRunServiceError';
  }
}

export class PipelineRunValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`PipelineRun validation failed: ${errors.join('; ')}`);
    this.name = 'PipelineRunValidationError';
  }
}
