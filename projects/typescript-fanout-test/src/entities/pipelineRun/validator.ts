      import type { PipelineRunCreate, PipelineRunUpdate } from './model';

      export function validatePipelineRunCreate(input: PipelineRunCreate): string[] {
        const errors: string[] = [];
        if (input.pipelineId !== undefined && typeof input.pipelineId !== 'string') errors.push('pipelineId must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.triggeredBy !== undefined && typeof input.triggeredBy !== 'string') errors.push('triggeredBy must be a string');
if (input.startedAt !== undefined && input.startedAt !== null && !(input.startedAt instanceof Date)) errors.push('startedAt must be a Date or null');
if (input.completedAt !== undefined && input.completedAt !== null && !(input.completedAt instanceof Date)) errors.push('completedAt must be a Date or null');
        return errors;
      }

      export function validatePipelineRunUpdate(input: PipelineRunUpdate): string[] {
        const errors: string[] = [];
        if (input.pipelineId !== undefined && typeof input.pipelineId !== 'string') errors.push('pipelineId must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.triggeredBy !== undefined && typeof input.triggeredBy !== 'string') errors.push('triggeredBy must be a string');
if (input.startedAt !== undefined && input.startedAt !== null && !(input.startedAt instanceof Date)) errors.push('startedAt must be a Date or null');
if (input.completedAt !== undefined && input.completedAt !== null && !(input.completedAt instanceof Date)) errors.push('completedAt must be a Date or null');
        return errors;
      }

      export function isValidPipelineRunCreate(input: PipelineRunCreate): boolean {
        return validatePipelineRunCreate(input).length === 0;
      }

      export function isValidPipelineRunUpdate(input: PipelineRunUpdate): boolean {
        return validatePipelineRunUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownPipelineRunField(field: string): boolean {
        return [
          'id',
  'pipelineId',
  'status',
  'triggeredBy',
  'startedAt',
  'completedAt',
        ].includes(field);
      }
