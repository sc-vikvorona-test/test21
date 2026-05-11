      import type { MessageEntryCreate, MessageEntryUpdate } from './model';

      export function validateMessageEntryCreate(input: MessageEntryCreate): string[] {
        const errors: string[] = [];
        if (input.channelId !== undefined && typeof input.channelId !== 'string') errors.push('channelId must be a string');
if (input.authorId !== undefined && typeof input.authorId !== 'string') errors.push('authorId must be a string');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
if (input.editedAt !== undefined && input.editedAt !== null && !(input.editedAt instanceof Date)) errors.push('editedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateMessageEntryUpdate(input: MessageEntryUpdate): string[] {
        const errors: string[] = [];
        if (input.channelId !== undefined && typeof input.channelId !== 'string') errors.push('channelId must be a string');
if (input.authorId !== undefined && typeof input.authorId !== 'string') errors.push('authorId must be a string');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
if (input.editedAt !== undefined && input.editedAt !== null && !(input.editedAt instanceof Date)) errors.push('editedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidMessageEntryCreate(input: MessageEntryCreate): boolean {
        return validateMessageEntryCreate(input).length === 0;
      }

      export function isValidMessageEntryUpdate(input: MessageEntryUpdate): boolean {
        return validateMessageEntryUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownMessageEntryField(field: string): boolean {
        return [
          'id',
  'channelId',
  'authorId',
  'body',
  'editedAt',
  'createdAt',
        ].includes(field);
      }
