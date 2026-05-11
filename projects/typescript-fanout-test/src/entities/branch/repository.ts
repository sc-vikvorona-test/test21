import type { Branch, BranchCreate, BranchUpdate } from './model';
import { makeBranch, updateBranch } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class BranchRepository {
  private readonly byId = new Map<string, Branch>();
  private nextId = 1;

  all(): Branch[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Branch | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Branch {
    const found = this.byId.get(id);
    if (!found) throw new BranchNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Branch) => boolean): Branch | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Branch) => boolean): Branch[] {
    const out: Branch[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Branch[] {
    const out: Branch[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: BranchCreate): Branch {
    const id = `${this.nextId++}`;
    const entity = makeBranch({ ...create, id } as Partial<Branch> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: BranchUpdate): Branch {
    const current = this.requireById(id);
    const next = updateBranch(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: BranchCreate, predicate: (existing: Branch) => boolean): Branch {
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

  sortedBy<K extends keyof Branch>(key: K, order: 'asc' | 'desc' = 'asc'): Branch[] {
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

  batchInsert(items: BranchCreate[]): Branch[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: BranchUpdate }>): Branch[] {
    const out: Branch[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Branch[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class BranchNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Branch not found: ${id}`);
    this.name = 'BranchNotFoundError';
  }
}
