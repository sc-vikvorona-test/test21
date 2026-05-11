import type { Attachment, AttachmentCreate, AttachmentUpdate } from './model';
import { makeAttachment, updateAttachment } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class AttachmentRepository {
  private readonly byId = new Map<string, Attachment>();
  private nextId = 1;

  all(): Attachment[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Attachment | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Attachment {
    const found = this.byId.get(id);
    if (!found) throw new AttachmentNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Attachment) => boolean): Attachment | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Attachment) => boolean): Attachment[] {
    const out: Attachment[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Attachment[] {
    const out: Attachment[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: AttachmentCreate): Attachment {
    const id = `${this.nextId++}`;
    const entity = makeAttachment({ ...create, id } as Partial<Attachment> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: AttachmentUpdate): Attachment {
    const current = this.requireById(id);
    const next = updateAttachment(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: AttachmentCreate, predicate: (existing: Attachment) => boolean): Attachment {
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

  sortedBy<K extends keyof Attachment>(key: K, order: 'asc' | 'desc' = 'asc'): Attachment[] {
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

  batchInsert(items: AttachmentCreate[]): Attachment[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: AttachmentUpdate }>): Attachment[] {
    const out: Attachment[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Attachment[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class AttachmentNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Attachment not found: ${id}`);
    this.name = 'AttachmentNotFoundError';
  }
}
