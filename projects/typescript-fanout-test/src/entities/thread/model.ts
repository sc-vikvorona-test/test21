      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Thread {
        id: string;
channelId: string;
parentMessageId: string;
memberCount: number;
createdAt: Date | null;
      }

      export interface ThreadCreate {
        channelId: string;
parentMessageId: string;
memberCount: number;
      }

      export interface ThreadUpdate {
        channelId?: string;
parentMessageId?: string;
memberCount?: number;
createdAt?: Date | null;
      }

      export const ThreadFields = ['id', 'channelId', 'parentMessageId', 'memberCount', 'createdAt'] as const;
      export type ThreadField = (typeof ThreadFields)[number];

      /** Construct a new Thread with sensible defaults for optional fields. */
      export function makeThread(input: Partial<Thread> & { id: string }): Thread {
        return {
          id: input.id,
          channelId: input.channelId ?? '',
          parentMessageId: input.parentMessageId ?? '',
          memberCount: input.memberCount ?? 0,
          createdAt: input.createdAt ?? null,
        } as Thread;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateThread(current: Thread, patch: ThreadUpdate): Thread {
        const merged: Thread = { ...current };
        for (const key of Object.keys(patch) as ThreadField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickThreadFields(entity: Thread, fields: ThreadField[]): Partial<Thread> {
        const out: Partial<Thread> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneThread(entity: Thread): Thread {
        return JSON.parse(JSON.stringify(entity)) as Thread;
      }
