      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Comment {
        id: string;
body: string;
authorId: string;
subjectId: string;
subjectKind: string;
editedAt: Date | null;
createdAt: Date | null;
      }

      export interface CommentCreate {
        body: string;
authorId: string;
subjectId: string;
subjectKind: string;
editedAt: Date | null;
      }

      export interface CommentUpdate {
        body?: string;
authorId?: string;
subjectId?: string;
subjectKind?: string;
editedAt?: Date | null;
createdAt?: Date | null;
      }

      export const CommentFields = ['id', 'body', 'authorId', 'subjectId', 'subjectKind', 'editedAt', 'createdAt'] as const;
      export type CommentField = (typeof CommentFields)[number];

      /** Construct a new Comment with sensible defaults for optional fields. */
      export function makeComment(input: Partial<Comment> & { id: string }): Comment {
        return {
          id: input.id,
          body: input.body ?? '',
          authorId: input.authorId ?? '',
          subjectId: input.subjectId ?? '',
          subjectKind: input.subjectKind ?? '',
          editedAt: input.editedAt ?? null,
          createdAt: input.createdAt ?? null,
        } as Comment;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateComment(current: Comment, patch: CommentUpdate): Comment {
        const merged: Comment = { ...current };
        for (const key of Object.keys(patch) as CommentField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickCommentFields(entity: Comment, fields: CommentField[]): Partial<Comment> {
        const out: Partial<Comment> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneComment(entity: Comment): Comment {
        return JSON.parse(JSON.stringify(entity)) as Comment;
      }
