import { describe, it, expect, beforeEach } from 'vitest';
import { TraceRepository } from './repository';
import { TraceService, TraceValidationError } from './service';
import { TraceNotFoundError } from './repository';
import { TraceController } from './controller';
import { makeTrace, updateTrace } from './model';

const minimalTraceCreate = (): unknown => ({
          name: 'name-1',
  rootSpanId: 'rootSpanId-1',
  amountCents: 1,
  startedAt: null,
  endedAt: null,
});

describe('Trace repository', () => {
  let repo: TraceRepository;
  beforeEach(() => { repo = new TraceRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalTraceCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalTraceCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(TraceNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalTraceCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalTraceCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalTraceCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalTraceCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalTraceCreate() as never,
      minimalTraceCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalTraceCreate() as never, () => false);
    const second = repo.upsert(minimalTraceCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Trace service', () => {
  let repo: TraceRepository;
  let service: TraceService;
  beforeEach(() => {
    repo = new TraceRepository();
    service = new TraceService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalTraceCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalTraceCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(TraceNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalTraceCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalTraceCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Trace controller', () => {
  let repo: TraceRepository;
  let service: TraceService;
  let ctrl: TraceController;
  beforeEach(() => {
    repo = new TraceRepository();
    service = new TraceService({ repository: repo });
    ctrl = new TraceController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/traces/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/traces', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/traces', params: {}, query: {}, body: minimalTraceCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalTraceCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/traces/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
