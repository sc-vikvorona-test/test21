import { describe, it, expect, beforeEach } from 'vitest';
import { AlertRepository } from './repository';
import { AlertService, AlertValidationError } from './service';
import { AlertNotFoundError } from './repository';
import { AlertController } from './controller';
import { makeAlert, updateAlert } from './model';

const minimalAlertCreate = (): unknown => ({
          ruleId: 'ruleId-1',
  subjectId: 'subjectId-1',
  severity: 'severity-1',
  status: 'status-1',
  firedAt: null,
  resolvedAt: null,
});

describe('Alert repository', () => {
  let repo: AlertRepository;
  beforeEach(() => { repo = new AlertRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalAlertCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalAlertCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(AlertNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalAlertCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalAlertCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalAlertCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalAlertCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalAlertCreate() as never,
      minimalAlertCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalAlertCreate() as never, () => false);
    const second = repo.upsert(minimalAlertCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Alert service', () => {
  let repo: AlertRepository;
  let service: AlertService;
  beforeEach(() => {
    repo = new AlertRepository();
    service = new AlertService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalAlertCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalAlertCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(AlertNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalAlertCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalAlertCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Alert controller', () => {
  let repo: AlertRepository;
  let service: AlertService;
  let ctrl: AlertController;
  beforeEach(() => {
    repo = new AlertRepository();
    service = new AlertService({ repository: repo });
    ctrl = new AlertController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/alerts/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/alerts', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/alerts', params: {}, query: {}, body: minimalAlertCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalAlertCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/alerts/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
