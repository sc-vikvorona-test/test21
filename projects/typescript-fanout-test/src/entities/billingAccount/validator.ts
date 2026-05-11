      import type { BillingAccountCreate, BillingAccountUpdate } from './model';

      export function validateBillingAccountCreate(input: BillingAccountCreate): string[] {
        const errors: string[] = [];
        if (input.organizationId !== undefined && typeof input.organizationId !== 'string') errors.push('organizationId must be a string');
if (input.plan !== undefined && typeof input.plan !== 'string') errors.push('plan must be a string');
if (input.seats !== undefined && typeof input.seats !== 'number') errors.push('seats must be a number');
if (input.seats !== undefined && (input.seats as number) < 0) errors.push('seats must be non-negative');
if (input.currency !== undefined && typeof input.currency !== 'string') errors.push('currency must be a string');
if (input.trialEndsAt !== undefined && input.trialEndsAt !== null && !(input.trialEndsAt instanceof Date)) errors.push('trialEndsAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateBillingAccountUpdate(input: BillingAccountUpdate): string[] {
        const errors: string[] = [];
        if (input.organizationId !== undefined && typeof input.organizationId !== 'string') errors.push('organizationId must be a string');
if (input.plan !== undefined && typeof input.plan !== 'string') errors.push('plan must be a string');
if (input.seats !== undefined && typeof input.seats !== 'number') errors.push('seats must be a number');
if (input.seats !== undefined && (input.seats as number) < 0) errors.push('seats must be non-negative');
if (input.currency !== undefined && typeof input.currency !== 'string') errors.push('currency must be a string');
if (input.trialEndsAt !== undefined && input.trialEndsAt !== null && !(input.trialEndsAt instanceof Date)) errors.push('trialEndsAt must be a Date or null');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidBillingAccountCreate(input: BillingAccountCreate): boolean {
        return validateBillingAccountCreate(input).length === 0;
      }

      export function isValidBillingAccountUpdate(input: BillingAccountUpdate): boolean {
        return validateBillingAccountUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownBillingAccountField(field: string): boolean {
        return [
          'id',
  'organizationId',
  'plan',
  'seats',
  'currency',
  'trialEndsAt',
  'createdAt',
        ].includes(field);
      }
