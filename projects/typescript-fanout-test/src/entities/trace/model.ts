      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Trace {
        id: string;
name: string;
rootSpanId: string;
amountCents: number;
startedAt: Date | null;
endedAt: Date | null;
      }

      export interface TraceCreate {
        name: string;
rootSpanId: string;
amountCents: number;
startedAt: Date | null;
endedAt: Date | null;
      }

      export interface TraceUpdate {
        name?: string;
rootSpanId?: string;
amountCents?: number;
startedAt?: Date | null;
endedAt?: Date | null;
      }

      export const TraceFields = ['id', 'name', 'rootSpanId', 'amountCents', 'startedAt', 'endedAt'] as const;
      export type TraceField = (typeof TraceFields)[number];

      /** Construct a new Trace with sensible defaults for optional fields. */
      export function makeTrace(input: Partial<Trace> & { id: string }): Trace {
        return {
          id: input.id,
          name: input.name ?? '',
          rootSpanId: input.rootSpanId ?? '',
          amountCents: input.amountCents ?? 0,
          startedAt: input.startedAt ?? null,
          endedAt: input.endedAt ?? null,
        } as Trace;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateTrace(current: Trace, patch: TraceUpdate): Trace {
        const merged: Trace = { ...current };
        for (const key of Object.keys(patch) as TraceField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickTraceFields(entity: Trace, fields: TraceField[]): Partial<Trace> {
        const out: Partial<Trace> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneTrace(entity: Trace): Trace {
        return JSON.parse(JSON.stringify(entity)) as Trace;
      }
