import type { BillingAccount, BillingAccountCreate, BillingAccountUpdate } from './model';
import { makeBillingAccount, updateBillingAccount } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class BillingAccountRepository {
  private readonly byId = new Map<string, BillingAccount>();
  private nextId = 1;

  all(): BillingAccount[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): BillingAccount | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): BillingAccount {
    const found = this.byId.get(id);
    if (!found) throw new BillingAccountNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: BillingAccount) => boolean): BillingAccount | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: BillingAccount) => boolean): BillingAccount[] {
    const out: BillingAccount[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): BillingAccount[] {
    const out: BillingAccount[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: BillingAccountCreate): BillingAccount {
    const id = `${this.nextId++}`;
    const entity = makeBillingAccount({ ...create, id } as Partial<BillingAccount> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: BillingAccountUpdate): BillingAccount {
    const current = this.requireById(id);
    const next = updateBillingAccount(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: BillingAccountCreate, predicate: (existing: BillingAccount) => boolean): BillingAccount {
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

  sortedBy<K extends keyof BillingAccount>(key: K, order: 'asc' | 'desc' = 'asc'): BillingAccount[] {
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

  batchInsert(items: BillingAccountCreate[]): BillingAccount[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: BillingAccountUpdate }>): BillingAccount[] {
    const out: BillingAccount[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: BillingAccount[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class BillingAccountNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`BillingAccount not found: ${id}`);
    this.name = 'BillingAccountNotFoundError';
  }
}
