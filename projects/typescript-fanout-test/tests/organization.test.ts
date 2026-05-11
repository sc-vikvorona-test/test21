import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationRepository } from './repository';
import { OrganizationService, OrganizationValidationError } from './service';
import { OrganizationNotFoundError } from './repository';
import { OrganizationController } from './controller';
import { makeOrganization, updateOrganization } from './model';

const minimalOrganizationCreate = (): unknown => ({
          name: 'name-1',
  slug: 'slug-1',
  plan: 'plan-1',
  billingEmail: 'billingEmail-1',
  ownerId: 'ownerId-1',
});

describe('Organization repository', () => {
  let repo: OrganizationRepository;
  beforeEach(() => { repo = new OrganizationRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalOrganizationCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalOrganizationCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(OrganizationNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalOrganizationCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalOrganizationCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalOrganizationCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalOrganizationCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalOrganizationCreate() as never,
      minimalOrganizationCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalOrganizationCreate() as never, () => false);
    const second = repo.upsert(minimalOrganizationCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Organization service', () => {
  let repo: OrganizationRepository;
  let service: OrganizationService;
  beforeEach(() => {
    repo = new OrganizationRepository();
    service = new OrganizationService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalOrganizationCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalOrganizationCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(OrganizationNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalOrganizationCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalOrganizationCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Organization controller', () => {
  let repo: OrganizationRepository;
  let service: OrganizationService;
  let ctrl: OrganizationController;
  beforeEach(() => {
    repo = new OrganizationRepository();
    service = new OrganizationService({ repository: repo });
    ctrl = new OrganizationController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/organizations/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/organizations', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/organizations', params: {}, query: {}, body: minimalOrganizationCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalOrganizationCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/organizations/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
