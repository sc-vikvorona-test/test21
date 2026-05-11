import { describe, it, expect, beforeEach } from 'vitest';
import { CronJobRepository } from './repository';
import { CronJobService, CronJobValidationError } from './service';
import { CronJobNotFoundError } from './repository';
import { CronJobController } from './controller';
import { makeCronJob, updateCronJob } from './model';

const minimalCronJobCreate = (): unknown => ({
          scheduleId: 'scheduleId-1',
  command: 'command-1',
  status: 'status-1',
  lastRunAt: null,
  nextRunAt: null,
});

describe('CronJob repository', () => {
  let repo: CronJobRepository;
  beforeEach(() => { repo = new CronJobRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalCronJobCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalCronJobCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(CronJobNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalCronJobCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalCronJobCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalCronJobCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalCronJobCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalCronJobCreate() as never,
      minimalCronJobCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalCronJobCreate() as never, () => false);
    const second = repo.upsert(minimalCronJobCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('CronJob service', () => {
  let repo: CronJobRepository;
  let service: CronJobService;
  beforeEach(() => {
    repo = new CronJobRepository();
    service = new CronJobService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalCronJobCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalCronJobCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(CronJobNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalCronJobCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalCronJobCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('CronJob controller', () => {
  let repo: CronJobRepository;
  let service: CronJobService;
  let ctrl: CronJobController;
  beforeEach(() => {
    repo = new CronJobRepository();
    service = new CronJobService({ repository: repo });
    ctrl = new CronJobController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/cronJobs/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/cronJobs', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/cronJobs', params: {}, query: {}, body: minimalCronJobCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalCronJobCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/cronJobs/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
