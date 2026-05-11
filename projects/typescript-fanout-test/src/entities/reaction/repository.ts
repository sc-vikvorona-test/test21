import type { Reaction, ReactionCreate, ReactionUpdate } from './model';
import { makeReaction, updateReaction } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class ReactionRepository {
  private readonly byId = new Map<string, Reaction>();
  private nextId = 1;

  all(): Reaction[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Reaction | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Reaction {
    const found = this.byId.get(id);
    if (!found) throw new ReactionNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Reaction) => boolean): Reaction | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Reaction) => boolean): Reaction[] {
    const out: Reaction[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Reaction[] {
    const out: Reaction[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: ReactionCreate): Reaction {
    const id = `${this.nextId++}`;
    const entity = makeReaction({ ...create, id } as Partial<Reaction> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: ReactionUpdate): Reaction {
    const current = this.requireById(id);
    const next = updateReaction(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: ReactionCreate, predicate: (existing: Reaction) => boolean): Reaction {
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

  sortedBy<K extends keyof Reaction>(key: K, order: 'asc' | 'desc' = 'asc'): Reaction[] {
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

  batchInsert(items: ReactionCreate[]): Reaction[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: ReactionUpdate }>): Reaction[] {
    const out: Reaction[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Reaction[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class ReactionNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Reaction not found: ${id}`);
    this.name = 'ReactionNotFoundError';
  }
}
