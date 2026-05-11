import type { PullRequest, PullRequestCreate, PullRequestUpdate } from './model';
import { makePullRequest, updatePullRequest } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class PullRequestRepository {
  private readonly byId = new Map<string, PullRequest>();
  private nextId = 1;

  all(): PullRequest[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): PullRequest | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): PullRequest {
    const found = this.byId.get(id);
    if (!found) throw new PullRequestNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: PullRequest) => boolean): PullRequest | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: PullRequest) => boolean): PullRequest[] {
    const out: PullRequest[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): PullRequest[] {
    const out: PullRequest[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: PullRequestCreate): PullRequest {
    const id = `${this.nextId++}`;
    const entity = makePullRequest({ ...create, id } as Partial<PullRequest> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: PullRequestUpdate): PullRequest {
    const current = this.requireById(id);
    const next = updatePullRequest(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: PullRequestCreate, predicate: (existing: PullRequest) => boolean): PullRequest {
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

  sortedBy<K extends keyof PullRequest>(key: K, order: 'asc' | 'desc' = 'asc'): PullRequest[] {
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

  batchInsert(items: PullRequestCreate[]): PullRequest[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: PullRequestUpdate }>): PullRequest[] {
    const out: PullRequest[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: PullRequest[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class PullRequestNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`PullRequest not found: ${id}`);
    this.name = 'PullRequestNotFoundError';
  }
}
