      import type { UsageRecordCreate, UsageRecordUpdate } from './model';

      export function validateUsageRecordCreate(input: UsageRecordCreate): string[] {
        const errors: string[] = [];
        if (input.billingAccountId !== undefined && typeof input.billingAccountId !== 'string') errors.push('billingAccountId must be a string');
if (input.metric !== undefined && typeof input.metric !== 'string') errors.push('metric must be a string');
if (input.quantity !== undefined && typeof input.quantity !== 'number') errors.push('quantity must be a number');
if (input.quantity !== undefined && (input.quantity as number) < 0) errors.push('quantity must be non-negative');
if (input.recordedAt !== undefined && input.recordedAt !== null && !(input.recordedAt instanceof Date)) errors.push('recordedAt must be a Date or null');
        return errors;
      }

      export function validateUsageRecordUpdate(input: UsageRecordUpdate): string[] {
        const errors: string[] = [];
        if (input.billingAccountId !== undefined && typeof input.billingAccountId !== 'string') errors.push('billingAccountId must be a string');
if (input.metric !== undefined && typeof input.metric !== 'string') errors.push('metric must be a string');
if (input.quantity !== undefined && typeof input.quantity !== 'number') errors.push('quantity must be a number');
if (input.quantity !== undefined && (input.quantity as number) < 0) errors.push('quantity must be non-negative');
if (input.recordedAt !== undefined && input.recordedAt !== null && !(input.recordedAt instanceof Date)) errors.push('recordedAt must be a Date or null');
        return errors;
      }

      export function isValidUsageRecordCreate(input: UsageRecordCreate): boolean {
        return validateUsageRecordCreate(input).length === 0;
      }

      export function isValidUsageRecordUpdate(input: UsageRecordUpdate): boolean {
        return validateUsageRecordUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownUsageRecordField(field: string): boolean {
        return [
          'id',
  'billingAccountId',
  'metric',
  'quantity',
  'recordedAt',
        ].includes(field);
      }
