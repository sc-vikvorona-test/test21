import { describe, it, expect, beforeEach } from 'vitest';
import { SnapshotRepository } from './repository';
import { SnapshotService, SnapshotValidationError } from './service';
import { SnapshotNotFoundError } from './repository';
import { SnapshotController } from './controller';
import { makeSnapshot, updateSnapshot } from './model';

const minimalSnapshotCreate = (): unknown => ({
          subjectId: 'subjectId-1',
  subjectKind: 'subjectKind-1',
  version: 'version-1',
  metadata: {},
});

describe('Snapshot repository', () => {
  let repo: SnapshotRepository;
  beforeEach(() => { repo = new SnapshotRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalSnapshotCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalSnapshotCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(SnapshotNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalSnapshotCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalSnapshotCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalSnapshotCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalSnapshotCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalSnapshotCreate() as never,
      minimalSnapshotCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalSnapshotCreate() as never, () => false);
    const second = repo.upsert(minimalSnapshotCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Snapshot service', () => {
  let repo: SnapshotRepository;
  let service: SnapshotService;
  beforeEach(() => {
    repo = new SnapshotRepository();
    service = new SnapshotService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalSnapshotCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalSnapshotCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(SnapshotNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalSnapshotCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalSnapshotCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Snapshot controller', () => {
  let repo: SnapshotRepository;
  let service: SnapshotService;
  let ctrl: SnapshotController;
  beforeEach(() => {
    repo = new SnapshotRepository();
    service = new SnapshotService({ repository: repo });
    ctrl = new SnapshotController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/snapshots/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/snapshots', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/snapshots', params: {}, query: {}, body: minimalSnapshotCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalSnapshotCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/snapshots/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
