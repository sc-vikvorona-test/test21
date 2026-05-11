      import type { CacheEntryCreate, CacheEntryUpdate } from './model';

      export function validateCacheEntryCreate(input: CacheEntryCreate): string[] {
        const errors: string[] = [];
        if (input.key !== undefined && typeof input.key !== 'string') errors.push('key must be a string');
if (input.scope !== undefined && typeof input.scope !== 'string') errors.push('scope must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateCacheEntryUpdate(input: CacheEntryUpdate): string[] {
        const errors: string[] = [];
        if (input.key !== undefined && typeof input.key !== 'string') errors.push('key must be a string');
if (input.scope !== undefined && typeof input.scope !== 'string') errors.push('scope must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidCacheEntryCreate(input: CacheEntryCreate): boolean {
        return validateCacheEntryCreate(input).length === 0;
      }

      export function isValidCacheEntryUpdate(input: CacheEntryUpdate): boolean {
        return validateCacheEntryUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownCacheEntryField(field: string): boolean {
        return [
          'id',
  'key',
  'scope',
  'amountCents',
  'lastUsedAt',
  'createdAt',
        ].includes(field);
      }
