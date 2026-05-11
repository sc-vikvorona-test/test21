      import type { BranchCreate, BranchUpdate } from './model';

      export function validateBranchCreate(input: BranchCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.commitSha !== undefined && typeof input.commitSha !== 'string') errors.push('commitSha must be a string');
if (input.isProtected !== undefined && typeof input.isProtected !== 'string') errors.push('isProtected must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateBranchUpdate(input: BranchUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.commitSha !== undefined && typeof input.commitSha !== 'string') errors.push('commitSha must be a string');
if (input.isProtected !== undefined && typeof input.isProtected !== 'string') errors.push('isProtected must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidBranchCreate(input: BranchCreate): boolean {
        return validateBranchCreate(input).length === 0;
      }

      export function isValidBranchUpdate(input: BranchUpdate): boolean {
        return validateBranchUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownBranchField(field: string): boolean {
        return [
          'id',
  'name',
  'repositoryId',
  'commitSha',
  'isProtected',
  'createdAt',
        ].includes(field);
      }
