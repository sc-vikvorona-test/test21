      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Reaction {
        id: string;
subjectId: string;
subjectKind: string;
userId: string;
emoji: string;
createdAt: Date | null;
      }

      export interface ReactionCreate {
        subjectId: string;
subjectKind: string;
userId: string;
emoji: string;
      }

      export interface ReactionUpdate {
        subjectId?: string;
subjectKind?: string;
userId?: string;
emoji?: string;
createdAt?: Date | null;
      }

      export const ReactionFields = ['id', 'subjectId', 'subjectKind', 'userId', 'emoji', 'createdAt'] as const;
      export type ReactionField = (typeof ReactionFields)[number];

      /** Construct a new Reaction with sensible defaults for optional fields. */
      export function makeReaction(input: Partial<Reaction> & { id: string }): Reaction {
        return {
          id: input.id,
          subjectId: input.subjectId ?? '',
          subjectKind: input.subjectKind ?? '',
          userId: input.userId ?? '',
          emoji: input.emoji ?? '',
          createdAt: input.createdAt ?? null,
        } as Reaction;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateReaction(current: Reaction, patch: ReactionUpdate): Reaction {
        const merged: Reaction = { ...current };
        for (const key of Object.keys(patch) as ReactionField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickReactionFields(entity: Reaction, fields: ReactionField[]): Partial<Reaction> {
        const out: Partial<Reaction> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneReaction(entity: Reaction): Reaction {
        return JSON.parse(JSON.stringify(entity)) as Reaction;
      }
