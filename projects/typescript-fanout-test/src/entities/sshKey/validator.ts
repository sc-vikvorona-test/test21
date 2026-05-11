      import type { SshKeyCreate, SshKeyUpdate } from './model';

      export function validateSshKeyCreate(input: SshKeyCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.fingerprint !== undefined && typeof input.fingerprint !== 'string') errors.push('fingerprint must be a string');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateSshKeyUpdate(input: SshKeyUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.fingerprint !== undefined && typeof input.fingerprint !== 'string') errors.push('fingerprint must be a string');
if (input.lastUsedAt !== undefined && input.lastUsedAt !== null && !(input.lastUsedAt instanceof Date)) errors.push('lastUsedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidSshKeyCreate(input: SshKeyCreate): boolean {
        return validateSshKeyCreate(input).length === 0;
      }

      export function isValidSshKeyUpdate(input: SshKeyUpdate): boolean {
        return validateSshKeyUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownSshKeyField(field: string): boolean {
        return [
          'id',
  'name',
  'ownerId',
  'fingerprint',
  'lastUsedAt',
  'expiresAt',
  'createdAt',
        ].includes(field);
      }
