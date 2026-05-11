      import type { PipelineCreate, PipelineUpdate } from './model';

      export function validatePipelineCreate(input: PipelineCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.projectId !== undefined && typeof input.projectId !== 'string') errors.push('projectId must be a string');
if (input.definition !== undefined && typeof input.definition !== 'string') errors.push('definition must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validatePipelineUpdate(input: PipelineUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.projectId !== undefined && typeof input.projectId !== 'string') errors.push('projectId must be a string');
if (input.definition !== undefined && typeof input.definition !== 'string') errors.push('definition must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidPipelineCreate(input: PipelineCreate): boolean {
        return validatePipelineCreate(input).length === 0;
      }

      export function isValidPipelineUpdate(input: PipelineUpdate): boolean {
        return validatePipelineUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownPipelineField(field: string): boolean {
        return [
          'id',
  'name',
  'projectId',
  'definition',
  'active',
  'createdAt',
        ].includes(field);
      }
