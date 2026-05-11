import type { Pipeline, PipelineCreate, PipelineUpdate } from './model';
import { makePipeline, updatePipeline } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class PipelineRepository {
  private readonly byId = new Map<string, Pipeline>();
  private nextId = 1;

  all(): Pipeline[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Pipeline | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Pipeline {
    const found = this.byId.get(id);
    if (!found) throw new PipelineNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Pipeline) => boolean): Pipeline | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Pipeline) => boolean): Pipeline[] {
    const out: Pipeline[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Pipeline[] {
    const out: Pipeline[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: PipelineCreate): Pipeline {
    const id = `${this.nextId++}`;
    const entity = makePipeline({ ...create, id } as Partial<Pipeline> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: PipelineUpdate): Pipeline {
    const current = this.requireById(id);
    const next = updatePipeline(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: PipelineCreate, predicate: (existing: Pipeline) => boolean): Pipeline {
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

  sortedBy<K extends keyof Pipeline>(key: K, order: 'asc' | 'desc' = 'asc'): Pipeline[] {
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

  batchInsert(items: PipelineCreate[]): Pipeline[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: PipelineUpdate }>): Pipeline[] {
    const out: Pipeline[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Pipeline[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class PipelineNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Pipeline not found: ${id}`);
    this.name = 'PipelineNotFoundError';
  }
}
