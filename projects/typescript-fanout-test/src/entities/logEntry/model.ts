      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface LogEntry {
        id: string;
level: string;
message: string;
source: string;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface LogEntryCreate {
        level: string;
message: string;
source: string;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface LogEntryUpdate {
        level?: string;
message?: string;
source?: string;
metadata?: Record<string, unknown>;
recordedAt?: Date | null;
      }

      export const LogEntryFields = ['id', 'level', 'message', 'source', 'metadata', 'recordedAt'] as const;
      export type LogEntryField = (typeof LogEntryFields)[number];

      /** Construct a new LogEntry with sensible defaults for optional fields. */
      export function makeLogEntry(input: Partial<LogEntry> & { id: string }): LogEntry {
        return {
          id: input.id,
          level: input.level ?? '',
          message: input.message ?? '',
          source: input.source ?? '',
          metadata: input.metadata ?? {},
          recordedAt: input.recordedAt ?? null,
        } as LogEntry;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateLogEntry(current: LogEntry, patch: LogEntryUpdate): LogEntry {
        const merged: LogEntry = { ...current };
        for (const key of Object.keys(patch) as LogEntryField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickLogEntryFields(entity: LogEntry, fields: LogEntryField[]): Partial<LogEntry> {
        const out: Partial<LogEntry> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneLogEntry(entity: LogEntry): LogEntry {
        return JSON.parse(JSON.stringify(entity)) as LogEntry;
      }
