import { describe, it, expect, beforeEach } from 'vitest';
import { PipelineRepository } from './repository';
import { PipelineService, PipelineValidationError } from './service';
import { PipelineNotFoundError } from './repository';
import { PipelineController } from './controller';
import { makePipeline, updatePipeline } from './model';

const minimalPipelineCreate = (): unknown => ({
          name: 'name-1',
  projectId: 'projectId-1',
  definition: 'definition-1',
  active: false,
});

describe('Pipeline repository', () => {
  let repo: PipelineRepository;
  beforeEach(() => { repo = new PipelineRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalPipelineCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalPipelineCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(PipelineNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalPipelineCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalPipelineCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalPipelineCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalPipelineCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalPipelineCreate() as never,
      minimalPipelineCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalPipelineCreate() as never, () => false);
    const second = repo.upsert(minimalPipelineCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Pipeline service', () => {
  let repo: PipelineRepository;
  let service: PipelineService;
  beforeEach(() => {
    repo = new PipelineRepository();
    service = new PipelineService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalPipelineCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalPipelineCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(PipelineNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalPipelineCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalPipelineCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Pipeline controller', () => {
  let repo: PipelineRepository;
  let service: PipelineService;
  let ctrl: PipelineController;
  beforeEach(() => {
    repo = new PipelineRepository();
    service = new PipelineService({ repository: repo });
    ctrl = new PipelineController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/pipelines/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/pipelines', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/pipelines', params: {}, query: {}, body: minimalPipelineCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalPipelineCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/pipelines/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
