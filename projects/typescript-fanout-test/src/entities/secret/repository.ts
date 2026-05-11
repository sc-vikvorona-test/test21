import type { Secret, SecretCreate, SecretUpdate } from './model';
import { makeSecret, updateSecret } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class SecretRepository {
  private readonly byId = new Map<string, Secret>();
  private nextId = 1;

  all(): Secret[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Secret | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Secret {
    const found = this.byId.get(id);
    if (!found) throw new SecretNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Secret) => boolean): Secret | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Secret) => boolean): Secret[] {
    const out: Secret[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Secret[] {
    const out: Secret[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: SecretCreate): Secret {
    const id = `${this.nextId++}`;
    const entity = makeSecret({ ...create, id } as Partial<Secret> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: SecretUpdate): Secret {
    const current = this.requireById(id);
    const next = updateSecret(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: SecretCreate, predicate: (existing: Secret) => boolean): Secret {
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

  sortedBy<K extends keyof Secret>(key: K, order: 'asc' | 'desc' = 'asc'): Secret[] {
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

  batchInsert(items: SecretCreate[]): Secret[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: SecretUpdate }>): Secret[] {
    const out: Secret[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Secret[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class SecretNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Secret not found: ${id}`);
    this.name = 'SecretNotFoundError';
  }
}
