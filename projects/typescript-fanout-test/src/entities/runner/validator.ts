      import type { RunnerCreate, RunnerUpdate } from './model';

      export function validateRunnerCreate(input: RunnerCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.lastSeenAt !== undefined && input.lastSeenAt !== null && !(input.lastSeenAt instanceof Date)) errors.push('lastSeenAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateRunnerUpdate(input: RunnerUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.kind !== undefined && typeof input.kind !== 'string') errors.push('kind must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.lastSeenAt !== undefined && input.lastSeenAt !== null && !(input.lastSeenAt instanceof Date)) errors.push('lastSeenAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidRunnerCreate(input: RunnerCreate): boolean {
        return validateRunnerCreate(input).length === 0;
      }

      export function isValidRunnerUpdate(input: RunnerUpdate): boolean {
        return validateRunnerUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownRunnerField(field: string): boolean {
        return [
          'id',
  'name',
  'kind',
  'ownerId',
  'active',
  'lastSeenAt',
  'createdAt',
        ].includes(field);
      }
