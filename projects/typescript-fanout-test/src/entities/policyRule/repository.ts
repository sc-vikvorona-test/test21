import type { PolicyRule, PolicyRuleCreate, PolicyRuleUpdate } from './model';
import { makePolicyRule, updatePolicyRule } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class PolicyRuleRepository {
  private readonly byId = new Map<string, PolicyRule>();
  private nextId = 1;

  all(): PolicyRule[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): PolicyRule | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): PolicyRule {
    const found = this.byId.get(id);
    if (!found) throw new PolicyRuleNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: PolicyRule) => boolean): PolicyRule | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: PolicyRule) => boolean): PolicyRule[] {
    const out: PolicyRule[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): PolicyRule[] {
    const out: PolicyRule[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: PolicyRuleCreate): PolicyRule {
    const id = `${this.nextId++}`;
    const entity = makePolicyRule({ ...create, id } as Partial<PolicyRule> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: PolicyRuleUpdate): PolicyRule {
    const current = this.requireById(id);
    const next = updatePolicyRule(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: PolicyRuleCreate, predicate: (existing: PolicyRule) => boolean): PolicyRule {
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

  sortedBy<K extends keyof PolicyRule>(key: K, order: 'asc' | 'desc' = 'asc'): PolicyRule[] {
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

  batchInsert(items: PolicyRuleCreate[]): PolicyRule[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: PolicyRuleUpdate }>): PolicyRule[] {
    const out: PolicyRule[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: PolicyRule[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class PolicyRuleNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`PolicyRule not found: ${id}`);
    this.name = 'PolicyRuleNotFoundError';
  }
}
