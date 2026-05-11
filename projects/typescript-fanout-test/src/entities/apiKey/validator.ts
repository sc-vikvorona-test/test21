      import type { ApiKeyCreate, ApiKeyUpdate } from './model';

      export function validateApiKeyCreate(input: ApiKeyCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateApiKeyUpdate(input: ApiKeyUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidApiKeyCreate(input: ApiKeyCreate): boolean {
        return validateApiKeyCreate(input).length === 0;
      }

      export function isValidApiKeyUpdate(input: ApiKeyUpdate): boolean {
        return validateApiKeyUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownApiKeyField(field: string): boolean {
        return [
          'id',
  'name',
  'ownerId',
  'scopes',
  'lastUsedAt',
  'expiresAt',
  'createdAt',
        ].includes(field);
      }
