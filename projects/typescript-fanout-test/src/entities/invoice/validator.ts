      import type { InvoiceCreate, InvoiceUpdate } from './model';

      export function validateInvoiceCreate(input: InvoiceCreate): string[] {
        const errors: string[] = [];
        if (input.billingAccountId !== undefined && typeof input.billingAccountId !== 'string') errors.push('billingAccountId must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.currency !== undefined && typeof input.currency !== 'string') errors.push('currency must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.paidAt !== undefined && input.paidAt !== null && !(input.paidAt instanceof Date)) errors.push('paidAt must be a Date or null');
if (input.dueAt !== undefined && input.dueAt !== null && !(input.dueAt instanceof Date)) errors.push('dueAt must be a Date or null');
        return errors;
      }

      export function validateInvoiceUpdate(input: InvoiceUpdate): string[] {
        const errors: string[] = [];
        if (input.billingAccountId !== undefined && typeof input.billingAccountId !== 'string') errors.push('billingAccountId must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.currency !== undefined && typeof input.currency !== 'string') errors.push('currency must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.paidAt !== undefined && input.paidAt !== null && !(input.paidAt instanceof Date)) errors.push('paidAt must be a Date or null');
if (input.dueAt !== undefined && input.dueAt !== null && !(input.dueAt instanceof Date)) errors.push('dueAt must be a Date or null');
        return errors;
      }

      export function isValidInvoiceCreate(input: InvoiceCreate): boolean {
        return validateInvoiceCreate(input).length === 0;
      }

      export function isValidInvoiceUpdate(input: InvoiceUpdate): boolean {
        return validateInvoiceUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownInvoiceField(field: string): boolean {
        return [
          'id',
  'billingAccountId',
  'amountCents',
  'currency',
  'status',
  'paidAt',
  'dueAt',
        ].includes(field);
      }
