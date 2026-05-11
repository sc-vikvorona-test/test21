      import type { NotificationCreate, NotificationUpdate } from './model';

      export function validateNotificationCreate(input: NotificationCreate): string[] {
        const errors: string[] = [];
        if (input.recipientId !== undefined && typeof input.recipientId !== 'string') errors.push('recipientId must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.subjectId !== undefined && typeof input.subjectId !== 'string') errors.push('subjectId must be a string');
if (input.readAt !== undefined && input.readAt !== null && !(input.readAt instanceof Date)) errors.push('readAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateNotificationUpdate(input: NotificationUpdate): string[] {
        const errors: string[] = [];
        if (input.recipientId !== undefined && typeof input.recipientId !== 'string') errors.push('recipientId must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.subjectId !== undefined && typeof input.subjectId !== 'string') errors.push('subjectId must be a string');
if (input.readAt !== undefined && input.readAt !== null && !(input.readAt instanceof Date)) errors.push('readAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidNotificationCreate(input: NotificationCreate): boolean {
        return validateNotificationCreate(input).length === 0;
      }

      export function isValidNotificationUpdate(input: NotificationUpdate): boolean {
        return validateNotificationUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownNotificationField(field: string): boolean {
        return [
          'id',
  'recipientId',
  'kind',
  'subjectId',
  'readAt',
  'createdAt',
        ].includes(field);
      }
