import { describe, it, expect, beforeEach } from 'vitest';
import { CacheEntryRepository } from './repository';
import { CacheEntryService, CacheEntryValidationError } from './service';
import { CacheEntryNotFoundError } from './repository';
import { CacheEntryController } from './controller';
import { makeCacheEntry, updateCacheEntry } from './model';

const minimalCacheEntryCreate = (): unknown => ({
          key: 'key-1',
  scope: 'scope-1',
  amountCents: 1,
  lastUsedAt: null,
});

describe('CacheEntry repository', () => {
  let repo: CacheEntryRepository;
  beforeEach(() => { repo = new CacheEntryRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalCacheEntryCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalCacheEntryCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(CacheEntryNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalCacheEntryCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalCacheEntryCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalCacheEntryCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalCacheEntryCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalCacheEntryCreate() as never,
      minimalCacheEntryCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalCacheEntryCreate() as never, () => false);
    const second = repo.upsert(minimalCacheEntryCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('CacheEntry service', () => {
  let repo: CacheEntryRepository;
  let service: CacheEntryService;
  beforeEach(() => {
    repo = new CacheEntryRepository();
    service = new CacheEntryService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalCacheEntryCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalCacheEntryCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(CacheEntryNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalCacheEntryCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalCacheEntryCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('CacheEntry controller', () => {
  let repo: CacheEntryRepository;
  let service: CacheEntryService;
  let ctrl: CacheEntryController;
  beforeEach(() => {
    repo = new CacheEntryRepository();
    service = new CacheEntryService({ repository: repo });
    ctrl = new CacheEntryController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/cacheEntries/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/cacheEntries', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/cacheEntries', params: {}, query: {}, body: minimalCacheEntryCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalCacheEntryCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/cacheEntries/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
