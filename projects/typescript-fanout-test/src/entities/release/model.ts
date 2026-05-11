      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Release {
        id: string;
tag: string;
repositoryId: string;
name: string;
body: string;
publishedAt: Date | null;
createdAt: Date | null;
      }

      export interface ReleaseCreate {
        tag: string;
repositoryId: string;
name: string;
body: string;
publishedAt: Date | null;
      }

      export interface ReleaseUpdate {
        tag?: string;
repositoryId?: string;
name?: string;
body?: string;
publishedAt?: Date | null;
createdAt?: Date | null;
      }

      export const ReleaseFields = ['id', 'tag', 'repositoryId', 'name', 'body', 'publishedAt', 'createdAt'] as const;
      export type ReleaseField = (typeof ReleaseFields)[number];

      /** Construct a new Release with sensible defaults for optional fields. */
      export function makeRelease(input: Partial<Release> & { id: string }): Release {
        return {
          id: input.id,
          tag: input.tag ?? '',
          repositoryId: input.repositoryId ?? '',
          name: input.name ?? '',
          body: input.body ?? '',
          publishedAt: input.publishedAt ?? null,
          createdAt: input.createdAt ?? null,
        } as Release;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateRelease(current: Release, patch: ReleaseUpdate): Release {
        const merged: Release = { ...current };
        for (const key of Object.keys(patch) as ReleaseField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickReleaseFields(entity: Release, fields: ReleaseField[]): Partial<Release> {
        const out: Partial<Release> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneRelease(entity: Release): Release {
        return JSON.parse(JSON.stringify(entity)) as Release;
      }
