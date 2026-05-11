      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface ApiKey {
        id: string;
name: string;
ownerId: string;
scopes: string[];
lastUsedAt: Date | null;
expiresAt: Date | null;
createdAt: Date | null;
      }

      export interface ApiKeyCreate {
        name: string;
ownerId: string;
scopes: string[];
lastUsedAt: Date | null;
expiresAt: Date | null;
      }

      export interface ApiKeyUpdate {
        name?: string;
ownerId?: string;
scopes?: string[];
lastUsedAt?: Date | null;
expiresAt?: Date | null;
createdAt?: Date | null;
      }

      export const ApiKeyFields = ['id', 'name', 'ownerId', 'scopes', 'lastUsedAt', 'expiresAt', 'createdAt'] as const;
      export type ApiKeyField = (typeof ApiKeyFields)[number];

      /** Construct a new ApiKey with sensible defaults for optional fields. */
      export function makeApiKey(input: Partial<ApiKey> & { id: string }): ApiKey {
        return {
          id: input.id,
          name: input.name ?? '',
          ownerId: input.ownerId ?? '',
          scopes: input.scopes ?? [],
          lastUsedAt: input.lastUsedAt ?? null,
          expiresAt: input.expiresAt ?? null,
          createdAt: input.createdAt ?? null,
        } as ApiKey;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateApiKey(current: ApiKey, patch: ApiKeyUpdate): ApiKey {
        const merged: ApiKey = { ...current };
        for (const key of Object.keys(patch) as ApiKeyField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickApiKeyFields(entity: ApiKey, fields: ApiKeyField[]): Partial<ApiKey> {
        const out: Partial<ApiKey> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneApiKey(entity: ApiKey): ApiKey {
        return JSON.parse(JSON.stringify(entity)) as ApiKey;
      }
