      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Issue {
        id: string;
number: number;
repositoryId: string;
title: string;
state: string;
priority: string;
assigneeId: string;
      }

      export interface IssueCreate {
        number: number;
repositoryId: string;
title: string;
state: string;
priority: string;
assigneeId: string;
      }

      export interface IssueUpdate {
        number?: number;
repositoryId?: string;
title?: string;
state?: string;
priority?: string;
assigneeId?: string;
      }

      export const IssueFields = ['id', 'number', 'repositoryId', 'title', 'state', 'priority', 'assigneeId'] as const;
      export type IssueField = (typeof IssueFields)[number];

      /** Construct a new Issue with sensible defaults for optional fields. */
      export function makeIssue(input: Partial<Issue> & { id: string }): Issue {
        return {
          id: input.id,
          number: input.number ?? 0,
          repositoryId: input.repositoryId ?? '',
          title: input.title ?? '',
          state: input.state ?? '',
          priority: input.priority ?? '',
          assigneeId: input.assigneeId ?? '',
        } as Issue;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateIssue(current: Issue, patch: IssueUpdate): Issue {
        const merged: Issue = { ...current };
        for (const key of Object.keys(patch) as IssueField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickIssueFields(entity: Issue, fields: IssueField[]): Partial<Issue> {
        const out: Partial<Issue> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneIssue(entity: Issue): Issue {
        return JSON.parse(JSON.stringify(entity)) as Issue;
      }
