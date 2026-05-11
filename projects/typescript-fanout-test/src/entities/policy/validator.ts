      import type { PolicyCreate, PolicyUpdate } from './model';

      export function validatePolicyCreate(input: PolicyCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.definition !== undefined && typeof input.definition !== 'string') errors.push('definition must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validatePolicyUpdate(input: PolicyUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.definition !== undefined && typeof input.definition !== 'string') errors.push('definition must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidPolicyCreate(input: PolicyCreate): boolean {
        return validatePolicyCreate(input).length === 0;
      }

      export function isValidPolicyUpdate(input: PolicyUpdate): boolean {
        return validatePolicyUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownPolicyField(field: string): boolean {
        return [
          'id',
  'name',
  'ownerId',
  'definition',
  'active',
  'createdAt',
        ].includes(field);
      }
