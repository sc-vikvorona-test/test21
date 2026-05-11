import { describe, it, expect, beforeEach } from 'vitest';
import { PullRequestRepository } from './repository';
import { PullRequestService, PullRequestValidationError } from './service';
import { PullRequestNotFoundError } from './repository';
import { PullRequestController } from './controller';
import { makePullRequest, updatePullRequest } from './model';

const minimalPullRequestCreate = (): unknown => ({
          number: 1,
  repositoryId: 'repositoryId-1',
  title: 'title-1',
  state: 'state-1',
  authorId: 'authorId-1',
  mergedAt: null,
});

describe('PullRequest repository', () => {
  let repo: PullRequestRepository;
  beforeEach(() => { repo = new PullRequestRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalPullRequestCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalPullRequestCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(PullRequestNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalPullRequestCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalPullRequestCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalPullRequestCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalPullRequestCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalPullRequestCreate() as never,
      minimalPullRequestCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalPullRequestCreate() as never, () => false);
    const second = repo.upsert(minimalPullRequestCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('PullRequest service', () => {
  let repo: PullRequestRepository;
  let service: PullRequestService;
  beforeEach(() => {
    repo = new PullRequestRepository();
    service = new PullRequestService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalPullRequestCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalPullRequestCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(PullRequestNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalPullRequestCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalPullRequestCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('PullRequest controller', () => {
  let repo: PullRequestRepository;
  let service: PullRequestService;
  let ctrl: PullRequestController;
  beforeEach(() => {
    repo = new PullRequestRepository();
    service = new PullRequestService({ repository: repo });
    ctrl = new PullRequestController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/pullRequests/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/pullRequests', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/pullRequests', params: {}, query: {}, body: minimalPullRequestCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalPullRequestCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/pullRequests/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
