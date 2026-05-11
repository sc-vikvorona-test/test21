import type { Asset, AssetCreate, AssetUpdate } from './model';
import { makeAsset, updateAsset } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class AssetRepository {
  private readonly byId = new Map<string, Asset>();
  private nextId = 1;

  all(): Asset[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Asset | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Asset {
    const found = this.byId.get(id);
    if (!found) throw new AssetNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Asset) => boolean): Asset | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Asset) => boolean): Asset[] {
    const out: Asset[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Asset[] {
    const out: Asset[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: AssetCreate): Asset {
    const id = `${this.nextId++}`;
    const entity = makeAsset({ ...create, id } as Partial<Asset> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: AssetUpdate): Asset {
    const current = this.requireById(id);
    const next = updateAsset(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: AssetCreate, predicate: (existing: Asset) => boolean): Asset {
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

  sortedBy<K extends keyof Asset>(key: K, order: 'asc' | 'desc' = 'asc'): Asset[] {
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

  batchInsert(items: AssetCreate[]): Asset[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: AssetUpdate }>): Asset[] {
    const out: Asset[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Asset[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class AssetNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Asset not found: ${id}`);
    this.name = 'AssetNotFoundError';
  }
}
