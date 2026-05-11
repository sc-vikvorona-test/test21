import type { Deployment, DeploymentCreate, DeploymentUpdate } from './model';
import { makeDeployment, updateDeployment } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class DeploymentRepository {
  private readonly byId = new Map<string, Deployment>();
  private nextId = 1;

  all(): Deployment[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Deployment | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Deployment {
    const found = this.byId.get(id);
    if (!found) throw new DeploymentNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Deployment) => boolean): Deployment | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Deployment) => boolean): Deployment[] {
    const out: Deployment[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Deployment[] {
    const out: Deployment[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: DeploymentCreate): Deployment {
    const id = `${this.nextId++}`;
    const entity = makeDeployment({ ...create, id } as Partial<Deployment> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: DeploymentUpdate): Deployment {
    const current = this.requireById(id);
    const next = updateDeployment(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: DeploymentCreate, predicate: (existing: Deployment) => boolean): Deployment {
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

  sortedBy<K extends keyof Deployment>(key: K, order: 'asc' | 'desc' = 'asc'): Deployment[] {
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

  batchInsert(items: DeploymentCreate[]): Deployment[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: DeploymentUpdate }>): Deployment[] {
    const out: Deployment[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Deployment[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class DeploymentNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Deployment not found: ${id}`);
    this.name = 'DeploymentNotFoundError';
  }
}
