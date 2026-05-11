      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Snapshot {
        id: string;
subjectId: string;
subjectKind: string;
version: string;
metadata: Record<string, unknown>;
createdAt: Date | null;
      }

      export interface SnapshotCreate {
        subjectId: string;
subjectKind: string;
version: string;
metadata: Record<string, unknown>;
      }

      export interface SnapshotUpdate {
        subjectId?: string;
subjectKind?: string;
version?: string;
metadata?: Record<string, unknown>;
createdAt?: Date | null;
      }

      export const SnapshotFields = ['id', 'subjectId', 'subjectKind', 'version', 'metadata', 'createdAt'] as const;
      export type SnapshotField = (typeof SnapshotFields)[number];

      /** Construct a new Snapshot with sensible defaults for optional fields. */
      export function makeSnapshot(input: Partial<Snapshot> & { id: string }): Snapshot {
        return {
          id: input.id,
          subjectId: input.subjectId ?? '',
          subjectKind: input.subjectKind ?? '',
          version: input.version ?? '',
          metadata: input.metadata ?? {},
          createdAt: input.createdAt ?? null,
        } as Snapshot;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateSnapshot(current: Snapshot, patch: SnapshotUpdate): Snapshot {
        const merged: Snapshot = { ...current };
        for (const key of Object.keys(patch) as SnapshotField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickSnapshotFields(entity: Snapshot, fields: SnapshotField[]): Partial<Snapshot> {
        const out: Partial<Snapshot> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneSnapshot(entity: Snapshot): Snapshot {
        return JSON.parse(JSON.stringify(entity)) as Snapshot;
      }
