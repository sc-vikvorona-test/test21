import { describe, it, expect, beforeEach } from 'vitest';
import { BillingAccountRepository } from './repository';
import { BillingAccountService, BillingAccountValidationError } from './service';
import { BillingAccountNotFoundError } from './repository';
import { BillingAccountController } from './controller';
import { makeBillingAccount, updateBillingAccount } from './model';

const minimalBillingAccountCreate = (): unknown => ({
          organizationId: 'organizationId-1',
  plan: 'plan-1',
  seats: 1,
  currency: 'currency-1',
  trialEndsAt: null,
});

describe('BillingAccount repository', () => {
  let repo: BillingAccountRepository;
  beforeEach(() => { repo = new BillingAccountRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalBillingAccountCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalBillingAccountCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(BillingAccountNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalBillingAccountCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalBillingAccountCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalBillingAccountCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalBillingAccountCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalBillingAccountCreate() as never,
      minimalBillingAccountCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalBillingAccountCreate() as never, () => false);
    const second = repo.upsert(minimalBillingAccountCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('BillingAccount service', () => {
  let repo: BillingAccountRepository;
  let service: BillingAccountService;
  beforeEach(() => {
    repo = new BillingAccountRepository();
    service = new BillingAccountService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalBillingAccountCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalBillingAccountCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(BillingAccountNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalBillingAccountCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalBillingAccountCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('BillingAccount controller', () => {
  let repo: BillingAccountRepository;
  let service: BillingAccountService;
  let ctrl: BillingAccountController;
  beforeEach(() => {
    repo = new BillingAccountRepository();
    service = new BillingAccountService({ repository: repo });
    ctrl = new BillingAccountController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/billingAccounts/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/billingAccounts', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/billingAccounts', params: {}, query: {}, body: minimalBillingAccountCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalBillingAccountCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/billingAccounts/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
