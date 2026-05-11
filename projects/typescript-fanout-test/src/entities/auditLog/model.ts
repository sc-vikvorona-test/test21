      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface AuditLog {
        id: string;
actorId: string;
action: string;
resourceKind: string;
resourceId: string;
metadata: Record<string, unknown>;
createdAt: Date | null;
      }

      export interface AuditLogCreate {
        actorId: string;
action: string;
resourceKind: string;
resourceId: string;
metadata: Record<string, unknown>;
      }

      export interface AuditLogUpdate {
        actorId?: string;
action?: string;
resourceKind?: string;
resourceId?: string;
metadata?: Record<string, unknown>;
createdAt?: Date | null;
      }

      export const AuditLogFields = ['id', 'actorId', 'action', 'resourceKind', 'resourceId', 'metadata', 'createdAt'] as const;
      export type AuditLogField = (typeof AuditLogFields)[number];

      /** Construct a new AuditLog with sensible defaults for optional fields. */
      export function makeAuditLog(input: Partial<AuditLog> & { id: string }): AuditLog {
        return {
          id: input.id,
          actorId: input.actorId ?? '',
          action: input.action ?? '',
          resourceKind: input.resourceKind ?? '',
          resourceId: input.resourceId ?? '',
          metadata: input.metadata ?? {},
          createdAt: input.createdAt ?? null,
        } as AuditLog;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateAuditLog(current: AuditLog, patch: AuditLogUpdate): AuditLog {
        const merged: AuditLog = { ...current };
        for (const key of Object.keys(patch) as AuditLogField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickAuditLogFields(entity: AuditLog, fields: AuditLogField[]): Partial<AuditLog> {
        const out: Partial<AuditLog> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneAuditLog(entity: AuditLog): AuditLog {
        return JSON.parse(JSON.stringify(entity)) as AuditLog;
      }
