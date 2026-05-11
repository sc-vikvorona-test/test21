import type { Webhook, WebhookCreate, WebhookUpdate } from './model';
import { makeWebhook, updateWebhook } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class WebhookRepository {
  private readonly byId = new Map<string, Webhook>();
  private nextId = 1;

  all(): Webhook[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Webhook | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Webhook {
    const found = this.byId.get(id);
    if (!found) throw new WebhookNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Webhook) => boolean): Webhook | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Webhook) => boolean): Webhook[] {
    const out: Webhook[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Webhook[] {
    const out: Webhook[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: WebhookCreate): Webhook {
    const id = `${this.nextId++}`;
    const entity = makeWebhook({ ...create, id } as Partial<Webhook> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: WebhookUpdate): Webhook {
    const current = this.requireById(id);
    const next = updateWebhook(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: WebhookCreate, predicate: (existing: Webhook) => boolean): Webhook {
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

  sortedBy<K extends keyof Webhook>(key: K, order: 'asc' | 'desc' = 'asc'): Webhook[] {
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

  batchInsert(items: WebhookCreate[]): Webhook[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: WebhookUpdate }>): Webhook[] {
    const out: Webhook[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Webhook[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class WebhookNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Webhook not found: ${id}`);
    this.name = 'WebhookNotFoundError';
  }
}
