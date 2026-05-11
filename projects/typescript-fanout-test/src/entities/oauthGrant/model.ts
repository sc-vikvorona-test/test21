      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface OauthGrant {
        id: string;
userId: string;
clientId: string;
scopes: string[];
expiresAt: Date | null;
revokedAt: Date | null;
      }

      export interface OauthGrantCreate {
        userId: string;
clientId: string;
scopes: string[];
expiresAt: Date | null;
revokedAt: Date | null;
      }

      export interface OauthGrantUpdate {
        userId?: string;
clientId?: string;
scopes?: string[];
expiresAt?: Date | null;
revokedAt?: Date | null;
      }

      export const OauthGrantFields = ['id', 'userId', 'clientId', 'scopes', 'expiresAt', 'revokedAt'] as const;
      export type OauthGrantField = (typeof OauthGrantFields)[number];

      /** Construct a new OauthGrant with sensible defaults for optional fields. */
      export function makeOauthGrant(input: Partial<OauthGrant> & { id: string }): OauthGrant {
        return {
          id: input.id,
          userId: input.userId ?? '',
          clientId: input.clientId ?? '',
          scopes: input.scopes ?? [],
          expiresAt: input.expiresAt ?? null,
          revokedAt: input.revokedAt ?? null,
        } as OauthGrant;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateOauthGrant(current: OauthGrant, patch: OauthGrantUpdate): OauthGrant {
        const merged: OauthGrant = { ...current };
        for (const key of Object.keys(patch) as OauthGrantField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickOauthGrantFields(entity: OauthGrant, fields: OauthGrantField[]): Partial<OauthGrant> {
        const out: Partial<OauthGrant> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneOauthGrant(entity: OauthGrant): OauthGrant {
        return JSON.parse(JSON.stringify(entity)) as OauthGrant;
      }
