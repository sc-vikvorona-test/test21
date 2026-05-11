      import type { TraceCreate, TraceUpdate } from './model';

      export function validateTraceCreate(input: TraceCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.rootSpanId !== undefined && typeof input.rootSpanId !== 'string') errors.push('rootSpanId must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.startedAt !== undefined && input.startedAt !== null && !(input.startedAt instanceof Date)) errors.push('startedAt must be a Date or null');
if (input.endedAt !== undefined && input.endedAt !== null && !(input.endedAt instanceof Date)) errors.push('endedAt must be a Date or null');
        return errors;
      }

      export function validateTraceUpdate(input: TraceUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.rootSpanId !== undefined && typeof input.rootSpanId !== 'string') errors.push('rootSpanId must be a string');
if (input.amountCents !== undefined && typeof input.amountCents !== 'number') errors.push('amountCents must be a number');
if (input.amountCents !== undefined && (input.amountCents as number) < 0) errors.push('amountCents must be non-negative');
if (input.startedAt !== undefined && input.startedAt !== null && !(input.startedAt instanceof Date)) errors.push('startedAt must be a Date or null');
if (input.endedAt !== undefined && input.endedAt !== null && !(input.endedAt instanceof Date)) errors.push('endedAt must be a Date or null');
        return errors;
      }

      export function isValidTraceCreate(input: TraceCreate): boolean {
        return validateTraceCreate(input).length === 0;
      }

      export function isValidTraceUpdate(input: TraceUpdate): boolean {
        return validateTraceUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownTraceField(field: string): boolean {
        return [
          'id',
  'name',
  'rootSpanId',
  'amountCents',
  'startedAt',
  'endedAt',
        ].includes(field);
      }
