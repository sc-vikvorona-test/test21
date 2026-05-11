      import type { WebhookCreate, WebhookUpdate } from './model';

      export function validateWebhookCreate(input: WebhookCreate): string[] {
        const errors: string[] = [];
        if (input.url !== undefined && typeof input.url !== 'string') errors.push('url must be a string');
if (input.secret !== undefined && typeof input.secret !== 'string') errors.push('secret must be a string');
if (input.events !== undefined && (!Array.isArray(input.events) || (input.events as string[]).some((x) => typeof x !== 'string'))) errors.push('events must be string[]');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateWebhookUpdate(input: WebhookUpdate): string[] {
        const errors: string[] = [];
        if (input.url !== undefined && typeof input.url !== 'string') errors.push('url must be a string');
if (input.secret !== undefined && typeof input.secret !== 'string') errors.push('secret must be a string');
if (input.events !== undefined && (!Array.isArray(input.events) || (input.events as string[]).some((x) => typeof x !== 'string'))) errors.push('events must be string[]');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidWebhookCreate(input: WebhookCreate): boolean {
        return validateWebhookCreate(input).length === 0;
      }

      export function isValidWebhookUpdate(input: WebhookUpdate): boolean {
        return validateWebhookUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownWebhookField(field: string): boolean {
        return [
          'id',
  'url',
  'secret',
  'events',
  'ownerId',
  'active',
  'createdAt',
        ].includes(field);
      }
