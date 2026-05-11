      import type { HookDeliveryCreate, HookDeliveryUpdate } from './model';

      export function validateHookDeliveryCreate(input: HookDeliveryCreate): string[] {
        const errors: string[] = [];
        if (input.webhookId !== undefined && typeof input.webhookId !== 'string') errors.push('webhookId must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.deliveredAt !== undefined && input.deliveredAt !== null && !(input.deliveredAt instanceof Date)) errors.push('deliveredAt must be a Date or null');
        return errors;
      }

      export function validateHookDeliveryUpdate(input: HookDeliveryUpdate): string[] {
        const errors: string[] = [];
        if (input.webhookId !== undefined && typeof input.webhookId !== 'string') errors.push('webhookId must be a string');
if (input.status !== undefined && typeof input.status !== 'string') errors.push('status must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.deliveredAt !== undefined && input.deliveredAt !== null && !(input.deliveredAt instanceof Date)) errors.push('deliveredAt must be a Date or null');
        return errors;
      }

      export function isValidHookDeliveryCreate(input: HookDeliveryCreate): boolean {
        return validateHookDeliveryCreate(input).length === 0;
      }

      export function isValidHookDeliveryUpdate(input: HookDeliveryUpdate): boolean {
        return validateHookDeliveryUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownHookDeliveryField(field: string): boolean {
        return [
          'id',
  'webhookId',
  'status',
  'amountCents',
  'deliveredAt',
        ].includes(field);
      }
