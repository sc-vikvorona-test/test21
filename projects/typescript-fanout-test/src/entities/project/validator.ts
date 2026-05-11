      import type { ProjectCreate, ProjectUpdate } from './model';

      export function validateProjectCreate(input: ProjectCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.workspaceId !== undefined && typeof input.workspaceId !== 'string') errors.push('workspaceId must be a string');
if (input.language !== undefined && typeof input.language !== 'string') errors.push('language must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.archivedAt !== undefined && input.archivedAt !== null && !(input.archivedAt instanceof Date)) errors.push('archivedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateProjectUpdate(input: ProjectUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.workspaceId !== undefined && typeof input.workspaceId !== 'string') errors.push('workspaceId must be a string');
if (input.language !== undefined && typeof input.language !== 'string') errors.push('language must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.archivedAt !== undefined && input.archivedAt !== null && !(input.archivedAt instanceof Date)) errors.push('archivedAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidProjectCreate(input: ProjectCreate): boolean {
        return validateProjectCreate(input).length === 0;
      }

      export function isValidProjectUpdate(input: ProjectUpdate): boolean {
        return validateProjectUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownProjectField(field: string): boolean {
        return [
          'id',
  'name',
  'workspaceId',
  'language',
  'status',
  'archivedAt',
  'createdAt',
        ].includes(field);
      }
