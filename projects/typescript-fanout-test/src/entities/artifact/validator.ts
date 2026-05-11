      import type { ArtifactCreate, ArtifactUpdate } from './model';

      export function validateArtifactCreate(input: ArtifactCreate): string[] {
        const errors: string[] = [];
        if (input.pipelineRunId !== undefined && typeof input.pipelineRunId !== 'string') errors.push('pipelineRunId must be a string');
if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.contentType !== undefined && typeof input.contentType !== 'string') errors.push('contentType must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
        return errors;
      }

      export function validateArtifactUpdate(input: ArtifactUpdate): string[] {
        const errors: string[] = [];
        if (input.pipelineRunId !== undefined && typeof input.pipelineRunId !== 'string') errors.push('pipelineRunId must be a string');
if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.contentType !== undefined && typeof input.contentType !== 'string') errors.push('contentType must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
if (input.expiresAt !== undefined && input.expiresAt !== null && !(input.expiresAt instanceof Date)) errors.push('expiresAt must be a Date or null');
        return errors;
      }

      export function isValidArtifactCreate(input: ArtifactCreate): boolean {
        return validateArtifactCreate(input).length === 0;
      }

      export function isValidArtifactUpdate(input: ArtifactUpdate): boolean {
        return validateArtifactUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownArtifactField(field: string): boolean {
        return [
          'id',
  'pipelineRunId',
  'name',
  'contentType',
  'amountCents',
  'createdAt',
  'expiresAt',
        ].includes(field);
      }
