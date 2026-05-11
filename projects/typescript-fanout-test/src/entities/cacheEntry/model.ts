      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface CacheEntry {
        id: string;
key: string;
scope: string;
amountCents: number;
lastUsedAt: Date | null;
createdAt: Date | null;
      }

      export interface CacheEntryCreate {
        key: string;
scope: string;
amountCents: number;
lastUsedAt: Date | null;
      }

      export interface CacheEntryUpdate {
        key?: string;
scope?: string;
amountCents?: number;
lastUsedAt?: Date | null;
createdAt?: Date | null;
      }

      export const CacheEntryFields = ['id', 'key', 'scope', 'amountCents', 'lastUsedAt', 'createdAt'] as const;
      export type CacheEntryField = (typeof CacheEntryFields)[number];

      /** Construct a new CacheEntry with sensible defaults for optional fields. */
      export function makeCacheEntry(input: Partial<CacheEntry> & { id: string }): CacheEntry {
        return {
          id: input.id,
          key: input.key ?? '',
          scope: input.scope ?? '',
          amountCents: input.amountCents ?? 0,
          lastUsedAt: input.lastUsedAt ?? null,
          createdAt: input.createdAt ?? null,
        } as CacheEntry;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateCacheEntry(current: CacheEntry, patch: CacheEntryUpdate): CacheEntry {
        const merged: CacheEntry = { ...current };
        for (const key of Object.keys(patch) as CacheEntryField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickCacheEntryFields(entity: CacheEntry, fields: CacheEntryField[]): Partial<CacheEntry> {
        const out: Partial<CacheEntry> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneCacheEntry(entity: CacheEntry): CacheEntry {
        return JSON.parse(JSON.stringify(entity)) as CacheEntry;
      }
