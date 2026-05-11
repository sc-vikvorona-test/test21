import type { AuditLog, AuditLogCreate, AuditLogUpdate } from './model';
import { makeAuditLog, updateAuditLog } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class AuditLogRepository {
  private readonly byId = new Map<string, AuditLog>();
  private nextId = 1;

  all(): AuditLog[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): AuditLog | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): AuditLog {
    const found = this.byId.get(id);
    if (!found) throw new AuditLogNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: AuditLog) => boolean): AuditLog | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: AuditLog) => boolean): AuditLog[] {
    const out: AuditLog[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): AuditLog[] {
    const out: AuditLog[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: AuditLogCreate): AuditLog {
    const id = `${this.nextId++}`;
    const entity = makeAuditLog({ ...create, id } as Partial<AuditLog> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: AuditLogUpdate): AuditLog {
    const current = this.requireById(id);
    const next = updateAuditLog(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: AuditLogCreate, predicate: (existing: AuditLog) => boolean): AuditLog {
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

  sortedBy<K extends keyof AuditLog>(key: K, order: 'asc' | 'desc' = 'asc'): AuditLog[] {
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

  batchInsert(items: AuditLogCreate[]): AuditLog[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: AuditLogUpdate }>): AuditLog[] {
    const out: AuditLog[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: AuditLog[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class AuditLogNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`AuditLog not found: ${id}`);
    this.name = 'AuditLogNotFoundError';
  }
}
