import type { User, UserCreate, UserUpdate } from './model';
import { makeUser, updateUser } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class UserRepository {
  private readonly byId = new Map<string, User>();
  private nextId = 1;

  all(): User[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): User | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): User {
    const found = this.byId.get(id);
    if (!found) throw new UserNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: User) => boolean): User | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: User) => boolean): User[] {
    const out: User[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): User[] {
    const out: User[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: UserCreate): User {
    const id = `${this.nextId++}`;
    const entity = makeUser({ ...create, id } as Partial<User> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: UserUpdate): User {
    const current = this.requireById(id);
    const next = updateUser(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: UserCreate, predicate: (existing: User) => boolean): User {
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

  sortedBy<K extends keyof User>(key: K, order: 'asc' | 'desc' = 'asc'): User[] {
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

  batchInsert(items: UserCreate[]): User[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: UserUpdate }>): User[] {
    const out: User[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: User[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class UserNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`User not found: ${id}`);
    this.name = 'UserNotFoundError';
  }
}
