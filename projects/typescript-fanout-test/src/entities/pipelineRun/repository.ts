import type { PipelineRun, PipelineRunCreate, PipelineRunUpdate } from './model';
import { makePipelineRun, updatePipelineRun } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class PipelineRunRepository {
  private readonly byId = new Map<string, PipelineRun>();
  private nextId = 1;

  all(): PipelineRun[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): PipelineRun | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): PipelineRun {
    const found = this.byId.get(id);
    if (!found) throw new PipelineRunNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: PipelineRun) => boolean): PipelineRun | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: PipelineRun) => boolean): PipelineRun[] {
    const out: PipelineRun[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): PipelineRun[] {
    const out: PipelineRun[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: PipelineRunCreate): PipelineRun {
    const id = `${this.nextId++}`;
    const entity = makePipelineRun({ ...create, id } as Partial<PipelineRun> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: PipelineRunUpdate): PipelineRun {
    const current = this.requireById(id);
    const next = updatePipelineRun(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: PipelineRunCreate, predicate: (existing: PipelineRun) => boolean): PipelineRun {
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

  sortedBy<K extends keyof PipelineRun>(key: K, order: 'asc' | 'desc' = 'asc'): PipelineRun[] {
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

  batchInsert(items: PipelineRunCreate[]): PipelineRun[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: PipelineRunUpdate }>): PipelineRun[] {
    const out: PipelineRun[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: PipelineRun[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class PipelineRunNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`PipelineRun not found: ${id}`);
    this.name = 'PipelineRunNotFoundError';
  }
}
