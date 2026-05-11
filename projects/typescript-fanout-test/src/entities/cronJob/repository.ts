import type { CronJob, CronJobCreate, CronJobUpdate } from './model';
import { makeCronJob, updateCronJob } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class CronJobRepository {
  private readonly byId = new Map<string, CronJob>();
  private nextId = 1;

  all(): CronJob[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): CronJob | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): CronJob {
    const found = this.byId.get(id);
    if (!found) throw new CronJobNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: CronJob) => boolean): CronJob | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: CronJob) => boolean): CronJob[] {
    const out: CronJob[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): CronJob[] {
    const out: CronJob[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: CronJobCreate): CronJob {
    const id = `${this.nextId++}`;
    const entity = makeCronJob({ ...create, id } as Partial<CronJob> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: CronJobUpdate): CronJob {
    const current = this.requireById(id);
    const next = updateCronJob(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: CronJobCreate, predicate: (existing: CronJob) => boolean): CronJob {
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

  sortedBy<K extends keyof CronJob>(key: K, order: 'asc' | 'desc' = 'asc'): CronJob[] {
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

  batchInsert(items: CronJobCreate[]): CronJob[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: CronJobUpdate }>): CronJob[] {
    const out: CronJob[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: CronJob[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class CronJobNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`CronJob not found: ${id}`);
    this.name = 'CronJobNotFoundError';
  }
}
