      import type { IntegrationCreate, IntegrationUpdate } from './model';

      export function validateIntegrationCreate(input: IntegrationCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.configRef !== undefined && typeof input.configRef !== 'string') errors.push('configRef must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateIntegrationUpdate(input: IntegrationUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.configRef !== undefined && typeof input.configRef !== 'string') errors.push('configRef must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidIntegrationCreate(input: IntegrationCreate): boolean {
        return validateIntegrationCreate(input).length === 0;
      }

      export function isValidIntegrationUpdate(input: IntegrationUpdate): boolean {
        return validateIntegrationUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownIntegrationField(field: string): boolean {
        return [
          'id',
  'name',
  'kind',
  'ownerId',
  'active',
  'configRef',
  'createdAt',
        ].includes(field);
      }
