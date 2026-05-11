import type { Artifact, ArtifactCreate, ArtifactUpdate } from './model';
import { ArtifactRepository, ArtifactNotFoundError } from './repository';
import { validateArtifactCreate, validateArtifactUpdate } from './validator';

export interface ArtifactServiceDeps {
  repository: ArtifactRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListArtifactOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Artifact;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above ArtifactRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class ArtifactService {
  private readonly repo: ArtifactRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: ArtifactServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: ArtifactCreate): Artifact {
    const errors = validateArtifactCreate(input);
    if (errors.length > 0) throw new ArtifactValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('ArtifactService.create', { id: created.id });
    return created;
  }

  get(id: string): Artifact {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof ArtifactNotFoundError) throw err;
      throw new ArtifactServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Artifact | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: ArtifactUpdate): Artifact {
    const errors = validateArtifactUpdate(patch);
    if (errors.length > 0) throw new ArtifactValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('ArtifactService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new ArtifactNotFoundError(id);
    this.logger('ArtifactService.delete', { id });
  }

  list(options: ListArtifactOptions = {}): Artifact[] {
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

  batchCreate(inputs: ArtifactCreate[]): Artifact[] {
    for (const input of inputs) {
      const errors = validateArtifactCreate(input);
      if (errors.length > 0) throw new ArtifactValidationError(errors);
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

  searchByField<K extends keyof Artifact>(field: K, value: Artifact[K]): Artifact[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class ArtifactServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArtifactServiceError';
  }
}

export class ArtifactValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Artifact validation failed: ${errors.join('; ')}`);
    this.name = 'ArtifactValidationError';
  }
}
