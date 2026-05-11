import type { Task, TaskCreate, TaskUpdate } from './model';
import { TaskRepository, TaskNotFoundError } from './repository';
import { validateTaskCreate, validateTaskUpdate } from './validator';

export interface TaskServiceDeps {
  repository: TaskRepository;
  clock?: () => Date;
  logger?: (msg: string, meta?: Record<string, unknown>) => void;
}

export interface ListTaskOptions {
  offset?: number;
  limit?: number;
  sortBy?: keyof Task;
  order?: 'asc' | 'desc';
}

/**
 * Business-logic layer above TaskRepository. Performs validation, dispatches
 * derived events, and surfaces structured errors. Synchronous to keep the fixture
 * deterministic for tests.
 */
export class TaskService {
  private readonly repo: TaskRepository;
  private readonly clock: () => Date;
  private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

  constructor(deps: TaskServiceDeps) {
    this.repo = deps.repository;
    this.clock = deps.clock ?? (() => new Date());
    this.logger = deps.logger ?? (() => { /* noop */ });
  }

  create(input: TaskCreate): Task {
    const errors = validateTaskCreate(input);
    if (errors.length > 0) throw new TaskValidationError(errors);
    const created = this.repo.insert(input);
    this.logger('TaskService.create', { id: created.id });
    return created;
  }

  get(id: string): Task {
    try {
      return this.repo.requireById(id);
    } catch (err) {
      if (err instanceof TaskNotFoundError) throw err;
      throw new TaskServiceError(`get failed: ${(err as Error).message}`);
    }
  }

  tryGet(id: string): Task | undefined {
    return this.repo.findById(id);
  }

  update(id: string, patch: TaskUpdate): Task {
    const errors = validateTaskUpdate(patch);
    if (errors.length > 0) throw new TaskValidationError(errors);
    const updated = this.repo.update(id, patch);
    this.logger('TaskService.update', { id });
    return updated;
  }

  delete(id: string): void {
    const existed = this.repo.delete(id);
    if (!existed) throw new TaskNotFoundError(id);
    this.logger('TaskService.delete', { id });
  }

  list(options: ListTaskOptions = {}): Task[] {
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

  batchCreate(inputs: TaskCreate[]): Task[] {
    for (const input of inputs) {
      const errors = validateTaskCreate(input);
      if (errors.length > 0) throw new TaskValidationError(errors);
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

  searchByField<K extends keyof Task>(field: K, value: Task[K]): Task[] {
    return this.repo.filter((entity) => entity[field] === value);
  }
}

export class TaskServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskServiceError';
  }
}

export class TaskValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Task validation failed: ${errors.join('; ')}`);
    this.name = 'TaskValidationError';
  }
}
