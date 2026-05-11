      import type { OauthGrantCreate, OauthGrantUpdate } from './model';

      export function validateOauthGrantCreate(input: OauthGrantCreate): string[] {
        const errors: string[] = [];
        if (input.userId !== undefined && typeof input.userId !== 'string') errors.push('userId must be a string');
if (input.clientId !== undefined && typeof input.clientId !== 'string') errors.push('clientId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.revokedAt !== undefined && input.revokedAt !== null && !(input.revokedAt instanceof Date)) errors.push('revokedAt must be a Date or null');
        return errors;
      }

      export function validateOauthGrantUpdate(input: OauthGrantUpdate): string[] {
        const errors: string[] = [];
        if (input.userId !== undefined && typeof input.userId !== 'string') errors.push('userId must be a string');
if (input.clientId !== undefined && typeof input.clientId !== 'string') errors.push('clientId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
if (input.revokedAt !== undefined && input.revokedAt !== null && !(input.revokedAt instanceof Date)) errors.push('revokedAt must be a Date or null');
        return errors;
      }

      export function isValidOauthGrantCreate(input: OauthGrantCreate): boolean {
        return validateOauthGrantCreate(input).length === 0;
      }

      export function isValidOauthGrantUpdate(input: OauthGrantUpdate): boolean {
        return validateOauthGrantUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownOauthGrantField(field: string): boolean {
        return [
          'id',
  'userId',
  'clientId',
  'scopes',
  'expiresAt',
  'revokedAt',
        ].includes(field);
      }
