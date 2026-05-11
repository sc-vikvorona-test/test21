#!/usr/bin/env python3
"""Generate ~15k LOC of synthetic TypeScript for testing the K-way fan-out path.

Produces a realistic-shaped CRUD service across 25 entities. Each entity gets:
  - model.ts     domain types + factory
  - repository   in-memory store with filtering/pagination
  - service      business logic, error variants
  - controller   HTTP-shaped handler methods
  - validator    field-level checks
  - test         vitest-style tests

No external dependencies; the output compiles independently of the host project.
"""
import os
from pathlib import Path
from textwrap import dedent

ROOT = Path("projects/typescript-fanout-test")

ENTITIES = [
    ("user", "User", "users", ["id", "email", "displayName", "passwordHash", "role", "verified", "createdAt"]),
    ("organization", "Organization", "organizations", ["id", "name", "slug", "plan", "billingEmail", "ownerId", "createdAt"]),
    ("workspace", "Workspace", "workspaces", ["id", "name", "organizationId", "visibility", "memberCount", "createdAt"]),
    ("project", "Project", "projects", ["id", "name", "workspaceId", "language", "status", "archivedAt", "createdAt"]),
    ("repository", "Repository", "repositories", ["id", "name", "projectId", "url", "defaultBranch", "isPrivate", "createdAt"]),
    ("pullRequest", "PullRequest", "pullRequests", ["id", "number", "repositoryId", "title", "state", "authorId", "mergedAt"]),
    ("issue", "Issue", "issues", ["id", "number", "repositoryId", "title", "state", "priority", "assigneeId"]),
    ("comment", "Comment", "comments", ["id", "body", "authorId", "subjectId", "subjectKind", "editedAt", "createdAt"]),
    ("review", "Review", "reviews", ["id", "pullRequestId", "reviewerId", "state", "submittedAt", "body"]),
    ("notification", "Notification", "notifications", ["id", "recipientId", "kind", "subjectId", "readAt", "createdAt"]),
    ("team", "Team", "teams", ["id", "name", "organizationId", "slug", "parentTeamId", "memberCount"]),
    ("membership", "Membership", "memberships", ["id", "userId", "teamId", "role", "joinedAt"]),
    ("invitation", "Invitation", "invitations", ["id", "email", "organizationId", "inviterId", "token", "acceptedAt", "expiresAt"]),
    ("apiKey", "ApiKey", "apiKeys", ["id", "name", "ownerId", "scopes", "lastUsedAt", "expiresAt", "createdAt"]),
    ("webhook", "Webhook", "webhooks", ["id", "url", "secret", "events", "ownerId", "active", "createdAt"]),
    ("deployment", "Deployment", "deployments", ["id", "projectId", "environment", "commitSha", "status", "deployedBy", "createdAt"]),
    ("environment", "Environment", "environments", ["id", "name", "projectId", "protectionRule", "approverIds", "createdAt"]),
    ("auditLog", "AuditLog", "auditLogs", ["id", "actorId", "action", "resourceKind", "resourceId", "metadata", "createdAt"]),
    ("billingAccount", "BillingAccount", "billingAccounts", ["id", "organizationId", "plan", "seats", "currency", "trialEndsAt", "createdAt"]),
    ("invoice", "Invoice", "invoices", ["id", "billingAccountId", "amountCents", "currency", "status", "paidAt", "dueAt"]),
    ("subscription", "Subscription", "subscriptions", ["id", "billingAccountId", "plan", "interval", "renewsAt", "canceledAt"]),
    ("usageRecord", "UsageRecord", "usageRecords", ["id", "billingAccountId", "metric", "quantity", "recordedAt"]),
    ("session", "Session", "sessions", ["id", "userId", "token", "userAgent", "ipAddress", "expiresAt", "createdAt"]),
    ("oauthGrant", "OauthGrant", "oauthGrants", ["id", "userId", "clientId", "scopes", "expiresAt", "revokedAt"]),
    ("featureFlag", "FeatureFlag", "featureFlags", ["id", "key", "description", "rolloutPercent", "enabled", "createdAt"]),
]

# --------------------------- file emitters ---------------------------

def field_type(name: str) -> str:
    if name == "id" or name.endswith("Id") or name == "token" or name == "secret":
        return "string"
    if name.endswith("At"):
        return "Date | null"
    if name in ("verified", "active", "isPrivate", "enabled"):
        return "boolean"
    if name in ("memberCount", "amountCents", "quantity", "rolloutPercent", "seats", "number"):
        return "number"
    if name == "scopes" or name == "events" or name == "approverIds":
        return "string[]"
    if name == "metadata":
        return "Record<string, unknown>"
    return "string"

def model_file(slug: str, klass: str, fields: list) -> str:
    field_lines = "\n".join(f"  {f}: {field_type(f)};" for f in fields)
    update_fields = "\n".join(f"  {f}?: {field_type(f)};" for f in fields if f != "id")
    create_fields = "\n".join(f"  {f}: {field_type(f)};" for f in fields if f not in ("id", "createdAt"))
    field_list = ", ".join(repr(f) for f in fields)
    return dedent(f"""\
        // Synthetic fixture — generated for split-review fan-out testing.
        // Not derived from any external codebase.

        export interface {klass} {{
        {field_lines}
        }}

        export interface {klass}Create {{
        {create_fields}
        }}

        export interface {klass}Update {{
        {update_fields}
        }}

        export const {klass}Fields = [{field_list}] as const;
        export type {klass}Field = (typeof {klass}Fields)[number];

        /** Construct a new {klass} with sensible defaults for optional fields. */
        export function make{klass}(input: Partial<{klass}> & {{ id: string }}): {klass} {{
          return {{
            id: input.id,
{chr(10).join(make_default_field(f, klass) for f in fields if f != "id")}
          }} as {klass};
        }}

        /** Shallow merge for partial updates. Reject identifier mutation. */
        export function update{klass}(current: {klass}, patch: {klass}Update): {klass} {{
          const merged: {klass} = {{ ...current }};
          for (const key of Object.keys(patch) as {klass}Field[]) {{
            if (key === 'id') continue;
            const value = (patch as Record<string, unknown>)[key];
            if (value === undefined) continue;
            (merged as Record<string, unknown>)[key] = value;
          }}
          return merged;
        }}

        export function pick{klass}Fields(entity: {klass}, fields: {klass}Field[]): Partial<{klass}> {{
          const out: Partial<{klass}> = {{}};
          for (const f of fields) {{
            (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
          }}
          return out;
        }}

        export function clone{klass}(entity: {klass}): {klass} {{
          return JSON.parse(JSON.stringify(entity)) as {klass};
        }}
    """)

def make_default_field(field: str, klass: str) -> str:
    t = field_type(field)
    default_map = {
        "string": "''",
        "number": "0",
        "boolean": "false",
        "string[]": "[]",
        "Date | null": "null",
        "Record<string, unknown>": "{}",
    }
    default = default_map.get(t, "null")
    return f"            {field}: input.{field} ?? {default},"

def repository_file(slug: str, klass: str, plural: str, fields: list) -> str:
    return dedent(f"""\
        import type {{ {klass}, {klass}Create, {klass}Update }} from './model';
        import {{ make{klass}, update{klass} }} from './model';

        /**
         * In-memory store. Methods are synchronous on purpose — this is a fixture, not a database.
         * Realistic data shapes; not derived from any external project.
         */
        export class {klass}Repository {{
          private readonly byId = new Map<string, {klass}>();
          private nextId = 1;

          all(): {klass}[] {{
            return Array.from(this.byId.values());
          }}

          count(): number {{
            return this.byId.size;
          }}

          findById(id: string): {klass} | undefined {{
            return this.byId.get(id);
          }}

          requireById(id: string): {klass} {{
            const found = this.byId.get(id);
            if (!found) throw new {klass}NotFoundError(id);
            return found;
          }}

          findFirst(predicate: (entity: {klass}) => boolean): {klass} | undefined {{
            for (const entity of this.byId.values()) {{
              if (predicate(entity)) return entity;
            }}
            return undefined;
          }}

          filter(predicate: (entity: {klass}) => boolean): {klass}[] {{
            const out: {klass}[] = [];
            for (const entity of this.byId.values()) {{
              if (predicate(entity)) out.push(entity);
            }}
            return out;
          }}

          paginate(offset: number, limit: number): {klass}[] {{
            const out: {klass}[] = [];
            let i = 0;
            for (const entity of this.byId.values()) {{
              if (i >= offset && i < offset + limit) out.push(entity);
              i++;
              if (i >= offset + limit) break;
            }}
            return out;
          }}

          insert(create: {klass}Create): {klass} {{
            const id = `${{this.nextId++}}`;
            const entity = make{klass}({{ ...create, id }} as Partial<{klass}> & {{ id: string }});
            this.byId.set(id, entity);
            return entity;
          }}

          update(id: string, patch: {klass}Update): {klass} {{
            const current = this.requireById(id);
            const next = update{klass}(current, patch);
            this.byId.set(id, next);
            return next;
          }}

          upsert(create: {klass}Create, predicate: (existing: {klass}) => boolean): {klass} {{
            const existing = this.findFirst(predicate);
            if (existing) return existing;
            return this.insert(create);
          }}

          delete(id: string): boolean {{
            return this.byId.delete(id);
          }}

          clear(): void {{
            this.byId.clear();
            this.nextId = 1;
          }}

          sortedBy<K extends keyof {klass}>(key: K, order: 'asc' | 'desc' = 'asc'): {klass}[] {{
            const items = this.all();
            const dir = order === 'asc' ? 1 : -1;
            items.sort((a, b) => {{
              const av = a[key] as unknown;
              const bv = b[key] as unknown;
              if (av === bv) return 0;
              if (av === null || av === undefined) return -dir;
              if (bv === null || bv === undefined) return dir;
              return (av as number) < (bv as number) ? -dir : dir;
            }});
            return items;
          }}

          batchInsert(items: {klass}Create[]): {klass}[] {{
            return items.map((item) => this.insert(item));
          }}

          batchUpdate(updates: Array<{{ id: string; patch: {klass}Update }}>): {klass}[] {{
            const out: {klass}[] = [];
            for (const u of updates) {{
              try {{ out.push(this.update(u.id, u.patch)); }} catch {{ /* swallow missing */ }}
            }}
            return out;
          }}

          replaceAll(items: {klass}[]): void {{
            this.byId.clear();
            for (const item of items) this.byId.set(item.id, item);
          }}
        }}

        export class {klass}NotFoundError extends Error {{
          constructor(public readonly id: string) {{
            super(`{klass} not found: ${{id}}`);
            this.name = '{klass}NotFoundError';
          }}
        }}
    """)

def service_file(slug: str, klass: str, plural: str, fields: list) -> str:
    return dedent(f"""\
        import type {{ {klass}, {klass}Create, {klass}Update }} from './model';
        import {{ {klass}Repository, {klass}NotFoundError }} from './repository';
        import {{ validate{klass}Create, validate{klass}Update }} from './validator';

        export interface {klass}ServiceDeps {{
          repository: {klass}Repository;
          clock?: () => Date;
          logger?: (msg: string, meta?: Record<string, unknown>) => void;
        }}

        export interface List{klass}Options {{
          offset?: number;
          limit?: number;
          sortBy?: keyof {klass};
          order?: 'asc' | 'desc';
        }}

        /**
         * Business-logic layer above {klass}Repository. Performs validation, dispatches
         * derived events, and surfaces structured errors. Synchronous to keep the fixture
         * deterministic for tests.
         */
        export class {klass}Service {{
          private readonly repo: {klass}Repository;
          private readonly clock: () => Date;
          private readonly logger: (msg: string, meta?: Record<string, unknown>) => void;

          constructor(deps: {klass}ServiceDeps) {{
            this.repo = deps.repository;
            this.clock = deps.clock ?? (() => new Date());
            this.logger = deps.logger ?? (() => {{ /* noop */ }});
          }}

          create(input: {klass}Create): {klass} {{
            const errors = validate{klass}Create(input);
            if (errors.length > 0) throw new {klass}ValidationError(errors);
            const created = this.repo.insert(input);
            this.logger('{klass}Service.create', {{ id: created.id }});
            return created;
          }}

          get(id: string): {klass} {{
            try {{
              return this.repo.requireById(id);
            }} catch (err) {{
              if (err instanceof {klass}NotFoundError) throw err;
              throw new {klass}ServiceError(`get failed: ${{(err as Error).message}}`);
            }}
          }}

          tryGet(id: string): {klass} | undefined {{
            return this.repo.findById(id);
          }}

          update(id: string, patch: {klass}Update): {klass} {{
            const errors = validate{klass}Update(patch);
            if (errors.length > 0) throw new {klass}ValidationError(errors);
            const updated = this.repo.update(id, patch);
            this.logger('{klass}Service.update', {{ id }});
            return updated;
          }}

          delete(id: string): void {{
            const existed = this.repo.delete(id);
            if (!existed) throw new {klass}NotFoundError(id);
            this.logger('{klass}Service.delete', {{ id }});
          }}

          list(options: List{klass}Options = {{}}): {klass}[] {{
            const offset = options.offset ?? 0;
            const limit = options.limit ?? 50;
            if (options.sortBy) {{
              const sorted = this.repo.sortedBy(options.sortBy, options.order);
              return sorted.slice(offset, offset + limit);
            }}
            return this.repo.paginate(offset, limit);
          }}

          countAll(): number {{
            return this.repo.count();
          }}

          batchCreate(inputs: {klass}Create[]): {klass}[] {{
            for (const input of inputs) {{
              const errors = validate{klass}Create(input);
              if (errors.length > 0) throw new {klass}ValidationError(errors);
            }}
            return this.repo.batchInsert(inputs);
          }}

          exists(id: string): boolean {{
            return this.repo.findById(id) !== undefined;
          }}

          /** Bulk delete with no failure semantics; safe to call with non-existent ids. */
          bulkDelete(ids: string[]): number {{
            let deleted = 0;
            for (const id of ids) if (this.repo.delete(id)) deleted++;
            return deleted;
          }}

          searchByField<K extends keyof {klass}>(field: K, value: {klass}[K]): {klass}[] {{
            return this.repo.filter((entity) => entity[field] === value);
          }}
        }}

        export class {klass}ServiceError extends Error {{
          constructor(message: string) {{
            super(message);
            this.name = '{klass}ServiceError';
          }}
        }}

        export class {klass}ValidationError extends Error {{
          constructor(public readonly errors: string[]) {{
            super(`{klass} validation failed: ${{errors.join('; ')}}`);
            this.name = '{klass}ValidationError';
          }}
        }}
    """)

def controller_file(slug: str, klass: str, plural: str, fields: list) -> str:
    return dedent(f"""\
        import type {{ {klass}Service }} from './service';
        import {{ {klass}ValidationError, {klass}ServiceError }} from './service';
        import {{ {klass}NotFoundError }} from './repository';

        export interface HttpRequest {{
          method: string;
          path: string;
          params: Record<string, string>;
          query: Record<string, string>;
          body: unknown;
          headers: Record<string, string>;
        }}

        export interface HttpResponse {{
          status: number;
          body: unknown;
          headers?: Record<string, string>;
        }}

        export class {klass}Controller {{
          constructor(private readonly service: {klass}Service) {{}}

          handleCreate(req: HttpRequest): HttpResponse {{
            try {{
              const created = this.service.create(req.body as never);
              return {{ status: 201, body: created }};
            }} catch (err) {{
              return errorToResponse(err);
            }}
          }}

          handleGet(req: HttpRequest): HttpResponse {{
            const id = req.params.id;
            if (!id) return {{ status: 400, body: {{ error: 'id required' }} }};
            try {{
              return {{ status: 200, body: this.service.get(id) }};
            }} catch (err) {{
              return errorToResponse(err);
            }}
          }}

          handleUpdate(req: HttpRequest): HttpResponse {{
            const id = req.params.id;
            if (!id) return {{ status: 400, body: {{ error: 'id required' }} }};
            try {{
              return {{ status: 200, body: this.service.update(id, req.body as never) }};
            }} catch (err) {{
              return errorToResponse(err);
            }}
          }}

          handleDelete(req: HttpRequest): HttpResponse {{
            const id = req.params.id;
            if (!id) return {{ status: 400, body: {{ error: 'id required' }} }};
            try {{
              this.service.delete(id);
              return {{ status: 204, body: null }};
            }} catch (err) {{
              return errorToResponse(err);
            }}
          }}

          handleList(req: HttpRequest): HttpResponse {{
            const offset = req.query.offset ? Number(req.query.offset) : 0;
            const limit = req.query.limit ? Number(req.query.limit) : 50;
            const sortBy = req.query.sortBy as keyof {klass} | undefined;
            const order = (req.query.order as 'asc' | 'desc' | undefined);
            if (Number.isNaN(offset) || offset < 0) {{
              return {{ status: 400, body: {{ error: 'offset must be a non-negative integer' }} }};
            }}
            if (Number.isNaN(limit) || limit < 1 || limit > 1000) {{
              return {{ status: 400, body: {{ error: 'limit must be between 1 and 1000' }} }};
            }}
            const items = this.service.list({{ offset, limit, sortBy, order }});
            return {{ status: 200, body: {{ items, total: this.service.countAll(), offset, limit }} }};
          }}

          handleBatchCreate(req: HttpRequest): HttpResponse {{
            if (!Array.isArray(req.body)) {{
              return {{ status: 400, body: {{ error: 'body must be an array' }} }};
            }}
            try {{
              const created = this.service.batchCreate(req.body as never);
              return {{ status: 201, body: created }};
            }} catch (err) {{
              return errorToResponse(err);
            }}
          }}

          handleBulkDelete(req: HttpRequest): HttpResponse {{
            const ids = (req.body as {{ ids?: string[] }}).ids;
            if (!Array.isArray(ids)) return {{ status: 400, body: {{ error: 'ids array required' }} }};
            const deleted = this.service.bulkDelete(ids);
            return {{ status: 200, body: {{ deleted }} }};
          }}

          register(routes: HttpRoute[]): void {{
            const prefix = '/{plural}';
            routes.push({{ method: 'POST', path: prefix, handler: (req) => this.handleCreate(req) }});
            routes.push({{ method: 'GET', path: `${{prefix}}/:id`, handler: (req) => this.handleGet(req) }});
            routes.push({{ method: 'PATCH', path: `${{prefix}}/:id`, handler: (req) => this.handleUpdate(req) }});
            routes.push({{ method: 'DELETE', path: `${{prefix}}/:id`, handler: (req) => this.handleDelete(req) }});
            routes.push({{ method: 'GET', path: prefix, handler: (req) => this.handleList(req) }});
            routes.push({{ method: 'POST', path: `${{prefix}}:batch`, handler: (req) => this.handleBatchCreate(req) }});
            routes.push({{ method: 'POST', path: `${{prefix}}:bulkDelete`, handler: (req) => this.handleBulkDelete(req) }});
          }}
        }}

        export interface HttpRoute {{
          method: string;
          path: string;
          handler: (req: HttpRequest) => HttpResponse;
        }}

        function errorToResponse(err: unknown): HttpResponse {{
          if (err instanceof {klass}NotFoundError) {{
            return {{ status: 404, body: {{ error: err.message }} }};
          }}
          if (err instanceof {klass}ValidationError) {{
            return {{ status: 422, body: {{ error: err.message, fields: err.errors }} }};
          }}
          if (err instanceof {klass}ServiceError) {{
            return {{ status: 500, body: {{ error: err.message }} }};
          }}
          return {{ status: 500, body: {{ error: 'internal error' }} }};
        }}
    """)

def validator_file(slug: str, klass: str, plural: str, fields: list) -> str:
    rules = []
    for f in fields:
        t = field_type(f)
        if f == "id":
            continue
        if t == "string":
            rules.append(f"  if (input.{f} !== undefined && typeof input.{f} !== 'string') errors.push('{f} must be a string');")
        elif t == "number":
            rules.append(f"  if (input.{f} !== undefined && typeof input.{f} !== 'number') errors.push('{f} must be a number');")
            rules.append(f"  if (input.{f} !== undefined && (input.{f} as number) < 0) errors.push('{f} must be non-negative');")
        elif t == "boolean":
            rules.append(f"  if (input.{f} !== undefined && typeof input.{f} !== 'boolean') errors.push('{f} must be a boolean');")
        elif t == "string[]":
            rules.append(f"  if (input.{f} !== undefined && (!Array.isArray(input.{f}) || (input.{f} as string[]).some((x) => typeof x !== 'string'))) errors.push('{f} must be string[]');")
        elif t.startswith("Date"):
            rules.append(f"  if (input.{f} !== undefined && input.{f} !== null && !(input.{f} instanceof Date)) errors.push('{f} must be a Date or null');")
    rules_block = "\n".join(rules) if rules else "  // no validations"
    return dedent(f"""\
        import type {{ {klass}Create, {klass}Update }} from './model';

        export function validate{klass}Create(input: {klass}Create): string[] {{
          const errors: string[] = [];
        {rules_block}
          return errors;
        }}

        export function validate{klass}Update(input: {klass}Update): string[] {{
          const errors: string[] = [];
        {rules_block}
          return errors;
        }}

        export function isValid{klass}Create(input: {klass}Create): boolean {{
          return validate{klass}Create(input).length === 0;
        }}

        export function isValid{klass}Update(input: {klass}Update): boolean {{
          return validate{klass}Update(input).length === 0;
        }}

        /** Light field-name guard for query parameters. */
        export function isKnown{klass}Field(field: string): boolean {{
          return [
        {chr(10).join("    " + repr(f) + "," for f in fields)}
          ].includes(field);
        }}
    """)

def test_file(slug: str, klass: str, plural: str, fields: list) -> str:
    return dedent(f"""\
        import {{ describe, it, expect, beforeEach }} from 'vitest';
        import {{ {klass}Repository }} from './repository';
        import {{ {klass}Service, {klass}ValidationError }} from './service';
        import {{ {klass}NotFoundError }} from './repository';
        import {{ {klass}Controller }} from './controller';
        import {{ make{klass}, update{klass} }} from './model';

        const minimal{klass}Create = (): unknown => ({{
        {chr(10).join("          " + f + ": " + minimal_default(f) + "," for f in fields if f not in ("id", "createdAt"))}
        }});

        describe('{klass} repository', () => {{
          let repo: {klass}Repository;
          beforeEach(() => {{ repo = new {klass}Repository(); }});

          it('inserts an entity and assigns an id', () => {{
            const created = repo.insert(minimal{klass}Create() as never);
            expect(created.id).toBeTruthy();
            expect(repo.findById(created.id)).toBeDefined();
          }});

          it('updates an existing entity', () => {{
            const created = repo.insert(minimal{klass}Create() as never);
            const next = repo.update(created.id, {{}} as never);
            expect(next.id).toBe(created.id);
          }});

          it('throws when updating a missing entity', () => {{
            expect(() => repo.update('does-not-exist', {{}} as never)).toThrow({klass}NotFoundError);
          }});

          it('lists in insertion order', () => {{
            for (let i = 0; i < 5; i++) repo.insert(minimal{klass}Create() as never);
            const all = repo.all();
            expect(all).toHaveLength(5);
          }});

          it('paginates correctly', () => {{
            for (let i = 0; i < 12; i++) repo.insert(minimal{klass}Create() as never);
            const page = repo.paginate(5, 4);
            expect(page).toHaveLength(4);
          }});

          it('deletes an entity', () => {{
            const created = repo.insert(minimal{klass}Create() as never);
            expect(repo.delete(created.id)).toBe(true);
            expect(repo.findById(created.id)).toBeUndefined();
          }});

          it('clears all entities', () => {{
            for (let i = 0; i < 3; i++) repo.insert(minimal{klass}Create() as never);
            repo.clear();
            expect(repo.count()).toBe(0);
          }});

          it('batch inserts and updates', () => {{
            const created = repo.batchInsert([
              minimal{klass}Create() as never,
              minimal{klass}Create() as never,
            ]);
            const updated = repo.batchUpdate([
              {{ id: created[0].id, patch: {{}} as never }},
              {{ id: 'missing', patch: {{}} as never }},
            ]);
            expect(updated).toHaveLength(1);
          }});

          it('upserts using a predicate', () => {{
            const first = repo.upsert(minimal{klass}Create() as never, () => false);
            const second = repo.upsert(minimal{klass}Create() as never, (e) => e.id === first.id);
            expect(second.id).toBe(first.id);
          }});
        }});

        describe('{klass} service', () => {{
          let repo: {klass}Repository;
          let service: {klass}Service;
          beforeEach(() => {{
            repo = new {klass}Repository();
            service = new {klass}Service({{ repository: repo }});
          }});

          it('creates an entity', () => {{
            const created = service.create(minimal{klass}Create() as never);
            expect(service.exists(created.id)).toBe(true);
          }});

          it('updates an entity', () => {{
            const created = service.create(minimal{klass}Create() as never);
            const updated = service.update(created.id, {{}} as never);
            expect(updated.id).toBe(created.id);
          }});

          it('throws when getting a missing entity', () => {{
            expect(() => service.get('missing')).toThrow({klass}NotFoundError);
          }});

          it('lists with pagination', () => {{
            for (let i = 0; i < 7; i++) service.create(minimal{klass}Create() as never);
            const page = service.list({{ offset: 0, limit: 5 }});
            expect(page).toHaveLength(5);
          }});

          it('searches by field', () => {{
            for (let i = 0; i < 3; i++) service.create(minimal{klass}Create() as never);
            expect(service.searchByField('id', 'missing')).toHaveLength(0);
          }});
        }});

        describe('{klass} controller', () => {{
          let repo: {klass}Repository;
          let service: {klass}Service;
          let ctrl: {klass}Controller;
          beforeEach(() => {{
            repo = new {klass}Repository();
            service = new {klass}Service({{ repository: repo }});
            ctrl = new {klass}Controller(service);
          }});

          it('returns 404 on GET for missing id', () => {{
            const res = ctrl.handleGet({{ method: 'GET', path: '/{plural}/missing', params: {{ id: 'missing' }}, query: {{}}, body: null, headers: {{}} }});
            expect(res.status).toBe(404);
          }});

          it('returns 400 when offset is invalid', () => {{
            const res = ctrl.handleList({{ method: 'GET', path: '/{plural}', params: {{}}, query: {{ offset: '-1' }}, body: null, headers: {{}} }});
            expect(res.status).toBe(400);
          }});

          it('returns 201 on POST create', () => {{
            const res = ctrl.handleCreate({{ method: 'POST', path: '/{plural}', params: {{}}, query: {{}}, body: minimal{klass}Create(), headers: {{}} }});
            expect(res.status).toBe(201);
          }});

          it('returns 204 on DELETE existing', () => {{
            const created = service.create(minimal{klass}Create() as never);
            const res = ctrl.handleDelete({{ method: 'DELETE', path: '/{plural}/' + created.id, params: {{ id: created.id }}, query: {{}}, body: null, headers: {{}} }});
            expect(res.status).toBe(204);
          }});
        }});
    """)

def minimal_default(field: str) -> str:
    t = field_type(field)
    if t == "string":
        return f"'{field}-1'"
    if t == "number":
        return "1"
    if t == "boolean":
        return "false"
    if t == "string[]":
        return "[]"
    if t.startswith("Date"):
        return "null"
    if t.startswith("Record"):
        return "{}"
    return "null"

# --------------------------- main generator ---------------------------

def main():
    base = ROOT / "src"
    base.mkdir(parents=True, exist_ok=True)
    (ROOT / "tests").mkdir(parents=True, exist_ok=True)

    # Root index.ts wiring up all entities.
    index_imports = []
    index_exports = []
    routes_init = []
    for slug, klass, plural, _ in ENTITIES:
        index_imports.append(f"import {{ {klass}Repository }} from './entities/{slug}/repository';")
        index_imports.append(f"import {{ {klass}Service }} from './entities/{slug}/service';")
        index_imports.append(f"import {{ {klass}Controller }} from './entities/{slug}/controller';")
        index_exports.append(f"export * from './entities/{slug}/model';")
        index_exports.append(f"export * from './entities/{slug}/repository';")
        index_exports.append(f"export * from './entities/{slug}/service';")
        index_exports.append(f"export * from './entities/{slug}/controller';")
        index_exports.append(f"export * from './entities/{slug}/validator';")
        routes_init.append(dedent(f"""\
            {{
              const repo = new {klass}Repository();
              const service = new {klass}Service({{ repository: repo }});
              const ctrl = new {klass}Controller(service);
              ctrl.register(routes);
            }}
        """))

    index_ts = "\n".join(index_imports) + "\n\n" + "\n".join(index_exports) + dedent("""

        import type { HttpRoute } from './entities/user/controller';

        export function buildRoutes(): HttpRoute[] {
          const routes: HttpRoute[] = [];
    """) + "\n".join(routes_init) + "  return routes;\n}\n"
    (base / "index.ts").write_text(index_ts)

    # Per-entity files.
    for slug, klass, plural, fields in ENTITIES:
        ent_dir = base / "entities" / slug
        ent_dir.mkdir(parents=True, exist_ok=True)
        (ent_dir / "model.ts").write_text(model_file(slug, klass, fields))
        (ent_dir / "repository.ts").write_text(repository_file(slug, klass, plural, fields))
        (ent_dir / "service.ts").write_text(service_file(slug, klass, plural, fields))
        (ent_dir / "controller.ts").write_text(controller_file(slug, klass, plural, fields))
        (ent_dir / "validator.ts").write_text(validator_file(slug, klass, plural, fields))
        (ROOT / "tests" / f"{slug}.test.ts").write_text(test_file(slug, klass, plural, fields))

    # package.json + tsconfig so the fixture is identifiable as its own project.
    (ROOT / "package.json").write_text(dedent("""\
        {
          "name": "typescript-fanout-test",
          "private": true,
          "version": "0.1.0",
          "description": "Synthetic ~15k-LOC TS fixture for testing the split-review K-way fan-out pipeline. Not derived from any external project.",
          "type": "module",
          "scripts": {
            "build": "tsc -p .",
            "test": "vitest run"
          },
          "devDependencies": {
            "typescript": "^5.4.0",
            "vitest": "^1.6.0"
          }
        }
    """))
    (ROOT / "tsconfig.json").write_text(dedent("""\
        {
          "compilerOptions": {
            "target": "ES2022",
            "module": "ESNext",
            "moduleResolution": "Bundler",
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "noEmit": true
          },
          "include": ["src/**/*.ts", "tests/**/*.ts"]
        }
    """))
    (ROOT / "README.md").write_text(dedent("""\
        # typescript-fanout-test

        Synthetic CRUD-service fixture (~15k LOC across 25 entities) for testing the
        sonar-review split-review K-way fan-out pipeline. Not derived from any external
        codebase; everything is generated from `gen.py` at the repo root.

        Each entity has the same shape:

        - `src/entities/<entity>/model.ts` — domain types + factory
        - `src/entities/<entity>/repository.ts` — in-memory store
        - `src/entities/<entity>/service.ts` — business-logic layer
        - `src/entities/<entity>/controller.ts` — HTTP-shaped handlers
        - `src/entities/<entity>/validator.ts` — field-level checks
        - `tests/<entity>.test.ts` — vitest cases

        The shape is deliberately repetitive so the diff is large but reviewable.
    """))

if __name__ == "__main__":
    main()
