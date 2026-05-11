      import type { ReviewCreate, ReviewUpdate } from './model';

      export function validateReviewCreate(input: ReviewCreate): string[] {
        const errors: string[] = [];
        if (input.pullRequestId !== undefined && typeof input.pullRequestId !== 'string') errors.push('pullRequestId must be a string');
if (input.reviewerId !== undefined && typeof input.reviewerId !== 'string') errors.push('reviewerId must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.submittedAt !== undefined && input.submittedAt !== null && !(input.submittedAt instanceof Date)) errors.push('submittedAt must be a Date or null');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
        return errors;
      }

      export function validateReviewUpdate(input: ReviewUpdate): string[] {
        const errors: string[] = [];
        if (input.pullRequestId !== undefined && typeof input.pullRequestId !== 'string') errors.push('pullRequestId must be a string');
if (input.reviewerId !== undefined && typeof input.reviewerId !== 'string') errors.push('reviewerId must be a string');
if (input.state !== undefined && typeof input.state !== 'string') errors.push('state must be a string');
if (input.submittedAt !== undefined && input.submittedAt !== null && !(input.submittedAt instanceof Date)) errors.push('submittedAt must be a Date or null');
if (input.body !== undefined && typeof input.body !== 'string') errors.push('body must be a string');
        return errors;
      }

      export function isValidReviewCreate(input: ReviewCreate): boolean {
        return validateReviewCreate(input).length === 0;
      }

      export function isValidReviewUpdate(input: ReviewUpdate): boolean {
        return validateReviewUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownReviewField(field: string): boolean {
        return [
          'id',
  'pullRequestId',
  'reviewerId',
  'state',
  'submittedAt',
  'body',
        ].includes(field);
      }
