      import type { MetricCreate, MetricUpdate } from './model';

      export function validateMetricCreate(input: MetricCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.unit !== undefined && typeof input.unit !== 'string') errors.push('unit must be a string');
if (input.quantity !== undefined && typeof input.quantity !== 'number') errors.push('quantity must be a number');
if (input.quantity !== undefined && (input.quantity as number) < 0) errors.push('quantity must be non-negative');
if (input.recordedAt !== undefined && input.recordedAt !== null && !(input.recordedAt instanceof Date)) errors.push('recordedAt must be a Date or null');
        return errors;
      }

      export function validateMetricUpdate(input: MetricUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.unit !== undefined && typeof input.unit !== 'string') errors.push('unit must be a string');
if (input.quantity !== undefined && typeof input.quantity !== 'number') errors.push('quantity must be a number');
if (input.quantity !== undefined && (input.quantity as number) < 0) errors.push('quantity must be non-negative');
if (input.recordedAt !== undefined && input.recordedAt !== null && !(input.recordedAt instanceof Date)) errors.push('recordedAt must be a Date or null');
        return errors;
      }

      export function isValidMetricCreate(input: MetricCreate): boolean {
        return validateMetricCreate(input).length === 0;
      }

      export function isValidMetricUpdate(input: MetricUpdate): boolean {
        return validateMetricUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownMetricField(field: string): boolean {
        return [
          'id',
  'name',
  'unit',
  'quantity',
  'metadata',
  'recordedAt',
        ].includes(field);
      }
