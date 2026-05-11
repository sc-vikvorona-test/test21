      import type { PullRequestCreate, PullRequestUpdate } from './model';

      export function validatePullRequestCreate(input: PullRequestCreate): string[] {
        const errors: string[] = [];
        if (input.number !== undefined && typeof input.number !== 'number') errors.push('number must be a number');
if (input.number !== undefined && (input.number as number) < 0) errors.push('number must be non-negative');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.title !== undefined && typeof input.title !== 'string') errors.push('title must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.authorId !== undefined && typeof input.authorId !== 'string') errors.push('authorId must be a string');
if (input.mergedAt !== undefined && input.mergedAt !== null && !(input.mergedAt instanceof Date)) errors.push('mergedAt must be a Date or null');
        return errors;
      }

      export function validatePullRequestUpdate(input: PullRequestUpdate): string[] {
        const errors: string[] = [];
        if (input.number !== undefined && typeof input.number !== 'number') errors.push('number must be a number');
if (input.number !== undefined && (input.number as number) < 0) errors.push('number must be non-negative');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.title !== undefined && typeof input.title !== 'string') errors.push('title must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.authorId !== undefined && typeof input.authorId !== 'string') errors.push('authorId must be a string');
if (input.mergedAt !== undefined && input.mergedAt !== null && !(input.mergedAt instanceof Date)) errors.push('mergedAt must be a Date or null');
        return errors;
      }

      export function isValidPullRequestCreate(input: PullRequestCreate): boolean {
        return validatePullRequestCreate(input).length === 0;
      }

      export function isValidPullRequestUpdate(input: PullRequestUpdate): boolean {
        return validatePullRequestUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownPullRequestField(field: string): boolean {
        return [
          'id',
  'number',
  'repositoryId',
  'title',
  'state',
  'authorId',
  'mergedAt',
        ].includes(field);
      }
