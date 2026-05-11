import { describe, it, expect, beforeEach } from 'vitest';
import { MentionRepository } from './repository';
import { MentionService, MentionValidationError } from './service';
import { MentionNotFoundError } from './repository';
import { MentionController } from './controller';
import { makeMention, updateMention } from './model';

const minimalMentionCreate = (): unknown => ({
          subjectId: 'subjectId-1',
  subjectKind: 'subjectKind-1',
  userId: 'userId-1',
  acknowledgedAt: null,
});

describe('Mention repository', () => {
  let repo: MentionRepository;
  beforeEach(() => { repo = new MentionRepository(); });

  it('inserts an entity and assigns an id', () => {
    const created = repo.insert(minimalMentionCreate() as never);
    expect(created.id).toBeTruthy();
    expect(repo.findById(created.id)).toBeDefined();
  });

  it('updates an existing entity', () => {
    const created = repo.insert(minimalMentionCreate() as never);
    const next = repo.update(created.id, {} as never);
    expect(next.id).toBe(created.id);
  });

  it('throws when updating a missing entity', () => {
    expect(() => repo.update('does-not-exist', {} as never)).toThrow(MentionNotFoundError);
  });

  it('lists in insertion order', () => {
    for (let i = 0; i < 5; i++) repo.insert(minimalMentionCreate() as never);
    const all = repo.all();
    expect(all).toHaveLength(5);
  });

  it('paginates correctly', () => {
    for (let i = 0; i < 12; i++) repo.insert(minimalMentionCreate() as never);
    const page = repo.paginate(5, 4);
    expect(page).toHaveLength(4);
  });

  it('deletes an entity', () => {
    const created = repo.insert(minimalMentionCreate() as never);
    expect(repo.delete(created.id)).toBe(true);
    expect(repo.findById(created.id)).toBeUndefined();
  });

  it('clears all entities', () => {
    for (let i = 0; i < 3; i++) repo.insert(minimalMentionCreate() as never);
    repo.clear();
    expect(repo.count()).toBe(0);
  });

  it('batch inserts and updates', () => {
    const created = repo.batchInsert([
      minimalMentionCreate() as never,
      minimalMentionCreate() as never,
    ]);
    const updated = repo.batchUpdate([
      { id: created[0].id, patch: {} as never },
      { id: 'missing', patch: {} as never },
    ]);
    expect(updated).toHaveLength(1);
  });

  it('upserts using a predicate', () => {
    const first = repo.upsert(minimalMentionCreate() as never, () => false);
    const second = repo.upsert(minimalMentionCreate() as never, (e) => e.id === first.id);
    expect(second.id).toBe(first.id);
  });
});

describe('Mention service', () => {
  let repo: MentionRepository;
  let service: MentionService;
  beforeEach(() => {
    repo = new MentionRepository();
    service = new MentionService({ repository: repo });
  });

  it('creates an entity', () => {
    const created = service.create(minimalMentionCreate() as never);
    expect(service.exists(created.id)).toBe(true);
  });

  it('updates an entity', () => {
    const created = service.create(minimalMentionCreate() as never);
    const updated = service.update(created.id, {} as never);
    expect(updated.id).toBe(created.id);
  });

  it('throws when getting a missing entity', () => {
    expect(() => service.get('missing')).toThrow(MentionNotFoundError);
  });

  it('lists with pagination', () => {
    for (let i = 0; i < 7; i++) service.create(minimalMentionCreate() as never);
    const page = service.list({ offset: 0, limit: 5 });
    expect(page).toHaveLength(5);
  });

  it('searches by field', () => {
    for (let i = 0; i < 3; i++) service.create(minimalMentionCreate() as never);
    expect(service.searchByField('id', 'missing')).toHaveLength(0);
  });
});

describe('Mention controller', () => {
  let repo: MentionRepository;
  let service: MentionService;
  let ctrl: MentionController;
  beforeEach(() => {
    repo = new MentionRepository();
    service = new MentionService({ repository: repo });
    ctrl = new MentionController(service);
  });

  it('returns 404 on GET for missing id', () => {
    const res = ctrl.handleGet({ method: 'GET', path: '/mentions/missing', params: { id: 'missing' }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(404);
  });

  it('returns 400 when offset is invalid', () => {
    const res = ctrl.handleList({ method: 'GET', path: '/mentions', params: {}, query: { offset: '-1' }, body: null, headers: {} });
    expect(res.status).toBe(400);
  });

  it('returns 201 on POST create', () => {
    const res = ctrl.handleCreate({ method: 'POST', path: '/mentions', params: {}, query: {}, body: minimalMentionCreate(), headers: {} });
    expect(res.status).toBe(201);
  });

  it('returns 204 on DELETE existing', () => {
    const created = service.create(minimalMentionCreate() as never);
    const res = ctrl.handleDelete({ method: 'DELETE', path: '/mentions/' + created.id, params: { id: created.id }, query: {}, body: null, headers: {} });
    expect(res.status).toBe(204);
  });
});
