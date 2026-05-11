      import type { RunnerGroupCreate, RunnerGroupUpdate } from './model';

      export function validateRunnerGroupCreate(input: RunnerGroupCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateRunnerGroupUpdate(input: RunnerGroupUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.scopes !== undefined && (!Array.isArray(input.scopes) || (input.scopes as string[]).some((x) => typeof x !== 'string'))) errors.push('scopes must be string[]');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidRunnerGroupCreate(input: RunnerGroupCreate): boolean {
        return validateRunnerGroupCreate(input).length === 0;
      }

      export function isValidRunnerGroupUpdate(input: RunnerGroupUpdate): boolean {
        return validateRunnerGroupUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownRunnerGroupField(field: string): boolean {
        return [
          'id',
  'name',
  'ownerId',
  'scopes',
  'createdAt',
        ].includes(field);
      }
