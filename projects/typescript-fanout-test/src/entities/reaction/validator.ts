      import type { ReactionCreate, ReactionUpdate } from './model';

      export function validateReactionCreate(input: ReactionCreate): string[] {
        const errors: string[] = [];
        if (input.subjectId !== undefined && typeof input.subjectId !== 'string') errors.push('subjectId must be a string');
if (input.subjectKind !== undefined && typeof input.subjectKind !== 'string') errors.push('subjectKind must be a string');
if (input.userId !== undefined && typeof input.userId !== 'string') errors.push('userId must be a string');
if (input.emoji !== undefined && typeof input.emoji !== 'string') errors.push('emoji must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateReactionUpdate(input: ReactionUpdate): string[] {
        const errors: string[] = [];
        if (input.subjectId !== undefined && typeof input.subjectId !== 'string') errors.push('subjectId must be a string');
if (input.subjectKind !== undefined && typeof input.subjectKind !== 'string') errors.push('subjectKind must be a string');
if (input.userId !== undefined && typeof input.userId !== 'string') errors.push('userId must be a string');
if (input.emoji !== undefined && typeof input.emoji !== 'string') errors.push('emoji must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidReactionCreate(input: ReactionCreate): boolean {
        return validateReactionCreate(input).length === 0;
      }

      export function isValidReactionUpdate(input: ReactionUpdate): boolean {
        return validateReactionUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownReactionField(field: string): boolean {
        return [
          'id',
  'subjectId',
  'subjectKind',
  'userId',
  'emoji',
  'createdAt',
        ].includes(field);
      }
