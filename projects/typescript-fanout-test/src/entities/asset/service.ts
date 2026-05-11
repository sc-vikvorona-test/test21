import type { Asset, AssetCreate, AssetUpdate } from './model';
import { AssetRepository, AssetNotFoundError } from './repository';
import { validateAssetCreate, validateAssetUpdate } from './validator';

export interface AssetServiceDeps {
  repository: AssetRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListAssetOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Asset;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above AssetRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class AssetService {
  private readonly repo: AssetRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: AssetServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: AssetCreate): Asset {
    const errors = validateAssetCreate(input);
    if (errors.length > 0) throw new AssetValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('AssetService.create', { id: created.id });
    return created;
  }

  get(id: string): Asset {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof AssetNotFoundError) throw err;
      throw new AssetServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Asset | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: AssetUpdate): Asset {
    const errors = validateAssetUpdate(patch);
    if (errors.length > 0) throw new AssetValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('AssetService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new AssetNotFoundError(id);
    this.logger('AssetService.delete', { id });
  }

  list(options: ListAssetOptions = {}): Asset[] {
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

  batchCreate(inputs: AssetCreate[]): Asset[] {
    for (const input of inputs) {
      const errors = validateAssetCreate(input);
      if (errors.length > 0) throw new AssetValidationError(errors);
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

  searchByField<K extends keyof Asset>(field: K, value: Asset[K]): Asset[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class AssetServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssetServiceError';
  }
}

export class AssetValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Asset validation failed: ${errors.join('; ')}`);
    this.name = 'AssetValidationError';
  }
}
