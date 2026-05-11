import type { LogEntry, LogEntryCreate, LogEntryUpdate } from './model';
import { makeLogEntry, updateLogEntry } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class LogEntryRepository {
  private readonly byId = new Map<string, LogEntry>();
  private nextId = 1;

  all(): LogEntry[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): LogEntry | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): LogEntry {
    const found = this.byId.get(id);
    if (!found) throw new LogEntryNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: LogEntry) => boolean): LogEntry | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: LogEntry) => boolean): LogEntry[] {
    const out: LogEntry[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): LogEntry[] {
    const out: LogEntry[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: LogEntryCreate): LogEntry {
    const id = `${this.nextId++}`;
    const entity = makeLogEntry({ ...create, id } as Partial<LogEntry> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: LogEntryUpdate): LogEntry {
    const current = this.requireById(id);
    const next = updateLogEntry(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: LogEntryCreate, predicate: (existing: LogEntry) => boolean): LogEntry {
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

  sortedBy<K extends keyof LogEntry>(key: K, order: 'asc' | 'desc' = 'asc'): LogEntry[] {
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

  batchInsert(items: LogEntryCreate[]): LogEntry[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: LogEntryUpdate }>): LogEntry[] {
    const out: LogEntry[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: LogEntry[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class LogEntryNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`LogEntry not found: ${id}`);
    this.name = 'LogEntryNotFoundError';
  }
}
