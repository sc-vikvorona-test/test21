import type { Project, ProjectCreate, ProjectUpdate } from './model';
import { makeProject, updateProject } from './model';

/**
 * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
 * Realistic data shapes; not derived from any external project.
 */
export class ProjectRepository {
  private readonly byId = new Map<string, Project>();
  private nextId = 1;

  all(): Project[] {
    return Array.from(this.byId.values());
  }

  count(): number {
    return this.byId.size;
  }

  findById(id: string): Project | undefined {
    return this.byId.get(id);
  }

  requireById(id: string): Project {
    const found = this.byId.get(id);
    if (!found) throw new ProjectNotFoundError(id);
    return found;
  }

  findFirst(predicate: (entity: Project) => boolean): Project | undefined {
    for (const entity of this.byId.values()) {
      if (predicate(entity)) return entity;
    }
    return undefined;
  }

  filter(predicate: (entity: Project) => boolean): Project[] {
    const out: Project[] = [];
    for (const entity of this.byId.values()) {
      if (predicate(entity)) out.push(entity);
    }
    return out;
  }

  paginate(offset: number, limit: number): Project[] {
    const out: Project[] = [];
    let i = 0;
    for (const entity of this.byId.values()) {
      if (i >= offset && i < offset + limit) out.push(entity);
      i++;
      if (i >= offset + limit) break;
    }
    return out;
  }

  insert(create: ProjectCreate): Project {
    const id = `${this.nextId++}`;
    const entity = makeProject({ ...create, id } as Partial<Project> & { id: string });
    this.byId.set(id, entity);
    return entity;
  }

  update(id: string, patch: ProjectUpdate): Project {
    const current = this.requireById(id);
    const next = updateProject(current, patch);
    this.byId.set(id, next);
    return next;
  }

  upsert(create: ProjectCreate, predicate: (existing: Project) => boolean): Project {
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

  sortedBy<K extends keyof Project>(key: K, order: 'asc' | 'desc' = 'asc'): Project[] {
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

  batchInsert(items: ProjectCreate[]): Project[] {
    return items.map((item) => this.insert(item));
  }

  batchUpdate(updates: Array<{ id: string; patch: ProjectUpdate }>): Project[] {
    const out: Project[] = [];
    for (const u of updates) {
      try { out.push(this.update(u.id, u.patch)); } catch { /* swallow missing */ }
    }
    return out;
  }

  replaceAll(items: Project[]): void {
    this.byId.clear();
    for (const item of items) this.byId.set(item.id, item);
  }
}

export class ProjectNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Project not found: ${id}`);
    this.name = 'ProjectNotFoundError';
  }
}
