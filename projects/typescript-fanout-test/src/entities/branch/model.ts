      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Branch {
        id: string;
name: string;
repositoryId: string;
commitSha: string;
isProtected: string;
createdAt: Date | null;
      }

      export interface BranchCreate {
        name: string;
repositoryId: string;
commitSha: string;
isProtected: string;
      }

      export interface BranchUpdate {
        name?: string;
repositoryId?: string;
commitSha?: string;
isProtected?: string;
createdAt?: Date | null;
      }

      export const BranchFields = ['id', 'name', 'repositoryId', 'commitSha', 'isProtected', 'createdAt'] as const;
      export type BranchField = (typeof BranchFields)[number];

      /** Construct a new Branch with sensible defaults for optional fields. */
      export function makeBranch(input: Partial<Branch> & { id: string }): Branch {
        return {
          id: input.id,
          name: input.name ?? '',
          repositoryId: input.repositoryId ?? '',
          commitSha: input.commitSha ?? '',
          isProtected: input.isProtected ?? '',
          createdAt: input.createdAt ?? null,
        } as Branch;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateBranch(current: Branch, patch: BranchUpdate): Branch {
        const merged: Branch = { ...current };
        for (const key of Object.keys(patch) as BranchField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickBranchFields(entity: Branch, fields: BranchField[]): Partial<Branch> {
        const out: Partial<Branch> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneBranch(entity: Branch): Branch {
        return JSON.parse(JSON.stringify(entity)) as Branch;
      }
