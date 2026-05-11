      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface EventRecord {
        id: string;
name: string;
source: string;
subjectId: string;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface EventRecordCreate {
        name: string;
source: string;
subjectId: string;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface EventRecordUpdate {
        name?: string;
source?: string;
subjectId?: string;
metadata?: Record<string, unknown>;
recordedAt?: Date | null;
      }

      export const EventRecordFields = ['id', 'name', 'source', 'subjectId', 'metadata', 'recordedAt'] as const;
      export type EventRecordField = (typeof EventRecordFields)[number];

      /** Construct a new EventRecord with sensible defaults for optional fields. */
      export function makeEventRecord(input: Partial<EventRecord> & { id: string }): EventRecord {
        return {
          id: input.id,
          name: input.name ?? '',
          source: input.source ?? '',
          subjectId: input.subjectId ?? '',
          metadata: input.metadata ?? {},
          recordedAt: input.recordedAt ?? null,
        } as EventRecord;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateEventRecord(current: EventRecord, patch: EventRecordUpdate): EventRecord {
        const merged: EventRecord = { ...current };
        for (const key of Object.keys(patch) as EventRecordField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickEventRecordFields(entity: EventRecord, fields: EventRecordField[]): Partial<EventRecord> {
        const out: Partial<EventRecord> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneEventRecord(entity: EventRecord): EventRecord {
        return JSON.parse(JSON.stringify(entity)) as EventRecord;
      }
