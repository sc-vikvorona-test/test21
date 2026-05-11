import type { Tag, TagCreate, TagUpdate } from './model';
import { makeTag, updateTag } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class TagRepository {
  private readonly byId = new Map<string, Tag>();
  private nextId = 1;

  all(): Tag[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Tag | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Tag {
    const found = this.byId.get(id);
    if (!found) throw new TagNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Tag) => boolean): Tag | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Tag) => boolean): Tag[] {
    const out: Tag[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Tag[] {
    const out: Tag[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: TagCreate): Tag {
    const id = `${this.nextId++}`;
    const entity = makeTag({ ...create, id } as Partial<Tag> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: TagUpdate): Tag {
    const current = this.requireById(id);
    const next = updateTag(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: TagCreate, predicate: (existing: Tag) => boolean): Tag {
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

  sortedBy<K extends keyof Tag>(key: K, order: 'asc' | 'desc' = 'asc'): Tag[] {
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

  batchInsert(items: TagCreate[]): Tag[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: TagUpdate }>): Tag[] {
    const out: Tag[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Tag[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class TagNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Tag not found: ${id}`);
    this.name = 'TagNotFoundError';
  }
}
