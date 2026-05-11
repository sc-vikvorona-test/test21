      import type { DeployKeyCreate, DeployKeyUpdate } from './model';

      export function validateDeployKeyCreate(input: DeployKeyCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.publicKey !== undefined && typeof input.publicKey !== 'string') errors.push('publicKey must be a string');
if (input.isReadOnly !== undefined && typeof input.isReadOnly !== 'string') errors.push('isReadOnly must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateDeployKeyUpdate(input: DeployKeyUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.publicKey !== undefined && typeof input.publicKey !== 'string') errors.push('publicKey must be a string');
if (input.isReadOnly !== undefined && typeof input.isReadOnly !== 'string') errors.push('isReadOnly must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidDeployKeyCreate(input: DeployKeyCreate): boolean {
        return validateDeployKeyCreate(input).length === 0;
      }

      export function isValidDeployKeyUpdate(input: DeployKeyUpdate): boolean {
        return validateDeployKeyUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownDeployKeyField(field: string): boolean {
        return [
          'id',
  'name',
  'repositoryId',
  'publicKey',
  'isReadOnly',
  'createdAt',
        ].includes(field);
      }
