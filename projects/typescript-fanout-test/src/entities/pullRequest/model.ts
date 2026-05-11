      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface PullRequest {
        id: string;
number: number;
repositoryId: string;
title: string;
state: string;
authorId: string;
mergedAt: Date | null;
      }

      export interface PullRequestCreate {
        number: number;
repositoryId: string;
title: string;
state: string;
authorId: string;
mergedAt: Date | null;
      }

      export interface PullRequestUpdate {
        number?: number;
repositoryId?: string;
title?: string;
state?: string;
authorId?: string;
mergedAt?: Date | null;
      }

      export const PullRequestFields = ['id', 'number', 'repositoryId', 'title', 'state', 'authorId', 'mergedAt'] as const;
      export type PullRequestField = (typeof PullRequestFields)[number];

      /** Construct a new PullRequest with sensible defaults for optional fields. */
      export function makePullRequest(input: Partial<PullRequest> & { id: string }): PullRequest {
        return {
          id: input.id,
          number: input.number ?? 0,
          repositoryId: input.repositoryId ?? '',
          title: input.title ?? '',
          state: input.state ?? '',
          authorId: input.authorId ?? '',
          mergedAt: input.mergedAt ?? null,
        } as PullRequest;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updatePullRequest(current: PullRequest, patch: PullRequestUpdate): PullRequest {
        const merged: PullRequest = { ...current };
        for (const key of Object.keys(patch) as PullRequestField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickPullRequestFields(entity: PullRequest, fields: PullRequestField[]): Partial<PullRequest> {
        const out: Partial<PullRequest> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function clonePullRequest(entity: PullRequest): PullRequest {
        return JSON.parse(JSON.stringify(entity)) as PullRequest;
      }
