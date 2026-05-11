      import type { SecretCreate, SecretUpdate } from './model';

      export function validateSecretCreate(input: SecretCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.valueRef !== undefined && typeof input.valueRef !== 'string') errors.push('valueRef must be a string');
if (input.rotatedAt !== undefined && input.rotatedAt !== null && !(input.rotatedAt instanceof Date)) errors.push('rotatedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateSecretUpdate(input: SecretUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.valueRef !== undefined && typeof input.valueRef !== 'string') errors.push('valueRef must be a string');
if (input.rotatedAt !== undefined && input.rotatedAt !== null && !(input.rotatedAt instanceof Date)) errors.push('rotatedAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidSecretCreate(input: SecretCreate): boolean {
        return validateSecretCreate(input).length === 0;
      }

      export function isValidSecretUpdate(input: SecretUpdate): boolean {
        return validateSecretUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownSecretField(field: string): boolean {
        return [
          'id',
  'name',
  'ownerId',
  'valueRef',
  'rotatedAt',
  'expiresAt',
  'createdAt',
        ].includes(field);
      }
