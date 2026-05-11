import { describe, it, expect, beforeEach } from 'vitest';
import { SessionRepository } from './repository';
import { SessionService, SessionValidationError } from './service';
import { SessionNotFoundError } from './repository';
import { SessionController } from './controller';
import { makeSession, updateSession } from './model';

const minimalSessionCreate = (): unknown => ({
          userId: 'userId-1',
  token: 'token-1',
  userAgent: 'userAgent-1',
  ipAddress: 'ipAddress-1',
  expiresAt: null,
});

describe('Session repository', () => {
  let repo: SessionRepository;
  beforeEach(() => { repo = new SessionRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalSessionCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalSessionCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(SessionNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalSessionCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalSessionCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalSessionCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalSessionCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalSessionCreate() as never,
      minimalSessionCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalSessionCreate() as never, () => false);
    const second = repo.upsert(minimalSessionCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Session service', () => {
  let repo: SessionRepository;
  let service: SessionService;
  beforeEach(() => {
    repo = new SessionRepository();
    service = new SessionService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalSessionCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalSessionCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(SessionNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalSessionCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalSessionCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Session controller', () => {
  let repo: SessionRepository;
  let service: SessionService;
  let ctrl: SessionController;
  beforeEach(() => {
    repo = new SessionRepository();
    service = new SessionService({ repository: repo });
    ctrl = new SessionController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/sessions/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/sessions', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/sessions', params: {}, query: {}, body: minimalSessionCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalSessionCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/sessions/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
