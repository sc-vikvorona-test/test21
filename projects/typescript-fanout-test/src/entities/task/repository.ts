import type { Task, TaskCreate, TaskUpdate } from './model';
import { makeTask, updateTask } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class TaskRepository {
  private readonly byId = new Map<string, Task>();
  private nextId = 1;

  all(): Task[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Task | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Task {
    const found = this.byId.get(id);
    if (!found) throw new TaskNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Task) => boolean): Task | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Task) => boolean): Task[] {
    const out: Task[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Task[] {
    const out: Task[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: TaskCreate): Task {
    const id = `${this.nextId++}`;
    const entity = makeTask({ ...create, id } as Partial<Task> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: TaskUpdate): Task {
    const current = this.requireById(id);
    const next = updateTask(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: TaskCreate, predicate: (existing: Task) => boolean): Task {
    const existing = this.findFirst(predicate);
    if (existing) return existing;
    return this.insert(create);
  }

  delete(id: string): boolean {
    return this.byId.delete(id);
  }

  clear(): void {
    this.byId.clear();
    this.nextId = 1;
  }

  sortedBy<K extends keyof Task>(key: K, order: 'asc' | 'desc' = 'asc'): Task[] {
    const items = this.all();
    const dir = order === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      const av = a[key] as unknown;
      const bv = b[key] as unknown;
      if (av === bv) return 0;
      if (av === null || av === undefined) return -dir;
      if (bv === null || bv === undefined) return dir;
      return (av as number) < (bv as number) ? -dir : dir;
    });
    return items;
  }

  batchInsert(items: TaskCreate[]): Task[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: TaskUpdate }>): Task[] {
    const out: Task[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Task[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class TaskNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Task not found: ${id}`);
    this.name = 'TaskNotFoundError';
  }
}
