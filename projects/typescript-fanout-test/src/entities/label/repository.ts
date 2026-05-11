import type { Label, LabelCreate, LabelUpdate } from './model';
import { makeLabel, updateLabel } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class LabelRepository {
  private readonly byId = new Map<string, Label>();
  private nextId = 1;

  all(): Label[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Label | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Label {
    const found = this.byId.get(id);
    if (!found) throw new LabelNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Label) => boolean): Label | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Label) => boolean): Label[] {
    const out: Label[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Label[] {
    const out: Label[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: LabelCreate): Label {
    const id = `${this.nextId++}`;
    const entity = makeLabel({ ...create, id } as Partial<Label> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: LabelUpdate): Label {
    const current = this.requireById(id);
    const next = updateLabel(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: LabelCreate, predicate: (existing: Label) => boolean): Label {
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

  sortedBy<K extends keyof Label>(key: K, order: 'asc' | 'desc' = 'asc'): Label[] {
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

  batchInsert(items: LabelCreate[]): Label[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: LabelUpdate }>): Label[] {
    const out: Label[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Label[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class LabelNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Label not found: ${id}`);
    this.name = 'LabelNotFoundError';
  }
}
