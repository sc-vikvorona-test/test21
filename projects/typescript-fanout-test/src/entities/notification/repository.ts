import type { Notification, NotificationCreate, NotificationUpdate } from './model';
import { makeNotification, updateNotification } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class NotificationRepository {
  private readonly byId = new Map<string, Notification>();
  private nextId = 1;

  all(): Notification[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Notification | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Notification {
    const found = this.byId.get(id);
    if (!found) throw new NotificationNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Notification) => boolean): Notification | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Notification) => boolean): Notification[] {
    const out: Notification[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Notification[] {
    const out: Notification[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: NotificationCreate): Notification {
    const id = `${this.nextId++}`;
    const entity = makeNotification({ ...create, id } as Partial<Notification> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: NotificationUpdate): Notification {
    const current = this.requireById(id);
    const next = updateNotification(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: NotificationCreate, predicate: (existing: Notification) => boolean): Notification {
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

  sortedBy<K extends keyof Notification>(key: K, order: 'asc' | 'desc' = 'asc'): Notification[] {
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

  batchInsert(items: NotificationCreate[]): Notification[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: NotificationUpdate }>): Notification[] {
    const out: Notification[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Notification[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class NotificationNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Notification not found: ${id}`);
    this.name = 'NotificationNotFoundError';
  }
}
