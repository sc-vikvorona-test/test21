import type { Issue, IssueCreate, IssueUpdate } from './model';
import { makeIssue, updateIssue } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class IssueRepository {
  private readonly byId = new Map<string, Issue>();
  private nextId = 1;

  all(): Issue[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Issue | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Issue {
    const found = this.byId.get(id);
    if (!found) throw new IssueNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Issue) => boolean): Issue | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Issue) => boolean): Issue[] {
    const out: Issue[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Issue[] {
    const out: Issue[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: IssueCreate): Issue {
    const id = `${this.nextId++}`;
    const entity = makeIssue({ ...create, id } as Partial<Issue> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: IssueUpdate): Issue {
    const current = this.requireById(id);
    const next = updateIssue(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: IssueCreate, predicate: (existing: Issue) => boolean): Issue {
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

  sortedBy<K extends keyof Issue>(key: K, order: 'asc' | 'desc' = 'asc'): Issue[] {
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

  batchInsert(items: IssueCreate[]): Issue[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: IssueUpdate }>): Issue[] {
    const out: Issue[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Issue[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class IssueNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Issue not found: ${id}`);
    this.name = 'IssueNotFoundError';
  }
}
