      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface MessageEntry {
        id: string;
channelId: string;
authorId: string;
body: string;
editedAt: Date | null;
createdAt: Date | null;
      }

      export interface MessageEntryCreate {
        channelId: string;
authorId: string;
body: string;
editedAt: Date | null;
      }

      export interface MessageEntryUpdate {
        channelId?: string;
authorId?: string;
body?: string;
editedAt?: Date | null;
createdAt?: Date | null;
      }

      export const MessageEntryFields = ['id', 'channelId', 'authorId', 'body', 'editedAt', 'createdAt'] as const;
      export type MessageEntryField = (typeof MessageEntryFields)[number];

      /** Construct a new MessageEntry with sensible defaults for optional fields. */
      export function makeMessageEntry(input: Partial<MessageEntry> & { id: string }): MessageEntry {
        return {
          id: input.id,
          channelId: input.channelId ?? '',
          authorId: input.authorId ?? '',
          body: input.body ?? '',
          editedAt: input.editedAt ?? null,
          createdAt: input.createdAt ?? null,
        } as MessageEntry;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateMessageEntry(current: MessageEntry, patch: MessageEntryUpdate): MessageEntry {
        const merged: MessageEntry = { ...current };
        for (const key of Object.keys(patch) as MessageEntryField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickMessageEntryFields(entity: MessageEntry, fields: MessageEntryField[]): Partial<MessageEntry> {
        const out: Partial<MessageEntry> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneMessageEntry(entity: MessageEntry): MessageEntry {
        return JSON.parse(JSON.stringify(entity)) as MessageEntry;
      }
