      import type { ReleaseCreate, ReleaseUpdate } from './model';

      export function validateReleaseCreate(input: ReleaseCreate): string[] {
        const errors: string[] = [];
        if (input.tag !== undefined && typeof input.tag !== 'string') errors.push('tag must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
if (input.publishedAt !== undefined && input.publishedAt !== null && !(input.publishedAt instanceof Date)) errors.push('publishedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateReleaseUpdate(input: ReleaseUpdate): string[] {
        const errors: string[] = [];
        if (input.tag !== undefined && typeof input.tag !== 'string') errors.push('tag must be a string');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
if (input.publishedAt !== undefined && input.publishedAt !== null && !(input.publishedAt instanceof Date)) errors.push('publishedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidReleaseCreate(input: ReleaseCreate): boolean {
        return validateReleaseCreate(input).length === 0;
      }

      export function isValidReleaseUpdate(input: ReleaseUpdate): boolean {
        return validateReleaseUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownReleaseField(field: string): boolean {
        return [
          'id',
  'tag',
  'repositoryId',
  'name',
  'body',
  'publishedAt',
  'createdAt',
        ].includes(field);
      }
