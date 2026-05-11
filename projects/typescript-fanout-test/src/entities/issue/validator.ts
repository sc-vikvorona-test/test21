      import type { IssueCreate, IssueUpdate } from './model';

      export function validateIssueCreate(input: IssueCreate): string[] {
        const errors: string[] = [];
        if (input.number !== undefined && typeof input.number !== 'number') errors.push('number must be a number');
if (input.number !== undefined && (input.number as number) < 0) errors.push('number must be non-negative');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.title !== undefined && typeof input.title !== 'string') errors.push('title must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.priority !== undefined && typeof input.priority !== 'string') errors.push('priority must be a string');
if (input.assigneeId !== undefined && typeof input.assigneeId !== 'string') errors.push('assigneeId must be a string');
        return errors;
      }

      export function validateIssueUpdate(input: IssueUpdate): string[] {
        const errors: string[] = [];
        if (input.number !== undefined && typeof input.number !== 'number') errors.push('number must be a number');
if (input.number !== undefined && (input.number as number) < 0) errors.push('number must be non-negative');
if (input.repositoryId !== undefined && typeof input.repositoryId !== 'string') errors.push('repositoryId must be a string');
if (input.title !== undefined && typeof input.title !== 'string') errors.push('title must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.priority !== undefined && typeof input.priority !== 'string') errors.push('priority must be a string');
if (input.assigneeId !== undefined && typeof input.assigneeId !== 'string') errors.push('assigneeId must be a string');
        return errors;
      }

      export function isValidIssueCreate(input: IssueCreate): boolean {
        return validateIssueCreate(input).length === 0;
      }

      export function isValidIssueUpdate(input: IssueUpdate): boolean {
        return validateIssueUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownIssueField(field: string): boolean {
        return [
          'id',
  'number',
  'repositoryId',
  'title',
  'state',
  'priority',
  'assigneeId',
        ].includes(field);
      }
