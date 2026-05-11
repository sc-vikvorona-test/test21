      import type { EnvironmentCreate, EnvironmentUpdate } from './model';

      export function validateEnvironmentCreate(input: EnvironmentCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.projectId !== undefined && typeof input.projectId !== 'string') errors.push('projectId must be a string');
if (input.protectionRule !== undefined && typeof input.protectionRule !== 'string') errors.push('protectionRule must be a string');
if (input.approverIds !== undefined && (!Array.isArray(input.approverIds) || (input.approverIds as string[]).some((x) => typeof x !== 'string'))) errors.push('approverIds must be string[]');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateEnvironmentUpdate(input: EnvironmentUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.projectId !== undefined && typeof input.projectId !== 'string') errors.push('projectId must be a string');
if (input.protectionRule !== undefined && typeof input.protectionRule !== 'string') errors.push('protectionRule must be a string');
if (input.approverIds !== undefined && (!Array.isArray(input.approverIds) || (input.approverIds as string[]).some((x) => typeof x !== 'string'))) errors.push('approverIds must be string[]');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidEnvironmentCreate(input: EnvironmentCreate): boolean {
        return validateEnvironmentCreate(input).length === 0;
      }

      export function isValidEnvironmentUpdate(input: EnvironmentUpdate): boolean {
        return validateEnvironmentUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownEnvironmentField(field: string): boolean {
        return [
          'id',
  'name',
  'projectId',
  'protectionRule',
  'approverIds',
  'createdAt',
        ].includes(field);
      }
