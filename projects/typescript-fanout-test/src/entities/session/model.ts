      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Session {
        id: string;
userId: string;
token: string;
userAgent: string;
ipAddress: string;
expiresAt: Date | null;
createdAt: Date | null;
      }

      export interface SessionCreate {
        userId: string;
token: string;
userAgent: string;
ipAddress: string;
expiresAt: Date | null;
      }

      export interface SessionUpdate {
        userId?: string;
token?: string;
userAgent?: string;
ipAddress?: string;
expiresAt?: Date | null;
createdAt?: Date | null;
      }

      export const SessionFields = ['id', 'userId', 'token', 'userAgent', 'ipAddress', 'expiresAt', 'createdAt'] as const;
      export type SessionField = (typeof SessionFields)[number];

      /** Construct a new Session with sensible defaults for optional fields. */
      export function makeSession(input: Partial<Session> & { id: string }): Session {
        return {
          id: input.id,
          userId: input.userId ?? '',
          token: input.token ?? '',
          userAgent: input.userAgent ?? '',
          ipAddress: input.ipAddress ?? '',
          expiresAt: input.expiresAt ?? null,
          createdAt: input.createdAt ?? null,
        } as Session;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateSession(current: Session, patch: SessionUpdate): Session {
        const merged: Session = { ...current };
        for (const key of Object.keys(patch) as SessionField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickSessionFields(entity: Session, fields: SessionField[]): Partial<Session> {
        const out: Partial<Session> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneSession(entity: Session): Session {
        return JSON.parse(JSON.stringify(entity)) as Session;
      }
