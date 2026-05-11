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
