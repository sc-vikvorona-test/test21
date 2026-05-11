      import type { AuditLogCreate, AuditLogUpdate } from './model';

      export function validateAuditLogCreate(input: AuditLogCreate): string[] {
        const errors: string[] = [];
        if (input.actorId !== undefined && typeof input.actorId !== 'string') errors.push('actorId must be a string');
if (input.action !== undefined && typeof input.action !== 'string') errors.push('action must be a string');
if (input.resourceKind !== undefined && typeof input.resourceKind !== 'string') errors.push('resourceKind must be a string');
if (input.resourceId !== undefined && typeof input.resourceId !== 'string') errors.push('resourceId must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateAuditLogUpdate(input: AuditLogUpdate): string[] {
        const errors: string[] = [];
        if (input.actorId !== undefined && typeof input.actorId !== 'string') errors.push('actorId must be a string');
if (input.action !== undefined && typeof input.action !== 'string') errors.push('action must be a string');
if (input.resourceKind !== undefined && typeof input.resourceKind !== 'string') errors.push('resourceKind must be a string');
if (input.resourceId !== undefined && typeof input.resourceId !== 'string') errors.push('resourceId must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidAuditLogCreate(input: AuditLogCreate): boolean {
        return validateAuditLogCreate(input).length === 0;
      }

      export function isValidAuditLogUpdate(input: AuditLogUpdate): boolean {
        return validateAuditLogUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownAuditLogField(field: string): boolean {
        return [
          'id',
  'actorId',
  'action',
  'resourceKind',
  'resourceId',
  'metadata',
  'createdAt',
        ].includes(field);
      }
