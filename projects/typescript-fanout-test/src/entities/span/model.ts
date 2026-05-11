      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Span {
        id: string;
traceId: string;
parentSpanId: string;
operationName: string;
amountCents: number;
startedAt: Date | null;
endedAt: Date | null;
      }

      export interface SpanCreate {
        traceId: string;
parentSpanId: string;
operationName: string;
amountCents: number;
startedAt: Date | null;
endedAt: Date | null;
      }

      export interface SpanUpdate {
        traceId?: string;
parentSpanId?: string;
operationName?: string;
amountCents?: number;
startedAt?: Date | null;
endedAt?: Date | null;
      }

      export const SpanFields = ['id', 'traceId', 'parentSpanId', 'operationName', 'amountCents', 'startedAt', 'endedAt'] as const;
      export type SpanField = (typeof SpanFields)[number];

      /** Construct a new Span with sensible defaults for optional fields. */
      export function makeSpan(input: Partial<Span> & { id: string }): Span {
        return {
          id: input.id,
          traceId: input.traceId ?? '',
          parentSpanId: input.parentSpanId ?? '',
          operationName: input.operationName ?? '',
          amountCents: input.amountCents ?? 0,
          startedAt: input.startedAt ?? null,
          endedAt: input.endedAt ?? null,
        } as Span;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateSpan(current: Span, patch: SpanUpdate): Span {
        const merged: Span = { ...current };
        for (const key of Object.keys(patch) as SpanField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickSpanFields(entity: Span, fields: SpanField[]): Partial<Span> {
        const out: Partial<Span> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneSpan(entity: Span): Span {
        return JSON.parse(JSON.stringify(entity)) as Span;
      }
