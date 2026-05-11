      import type { OrganizationCreate, OrganizationUpdate } from './model';

      export function validateOrganizationCreate(input: OrganizationCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.slug !== undefined && typeof input.slug !== 'string') errors.push('slug must be a string');
if (input.plan !== undefined && typeof input.plan !== 'string') errors.push('plan must be a string');
if (input.billingEmail !== undefined && typeof input.billingEmail !== 'string') errors.push('billingEmail must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateOrganizationUpdate(input: OrganizationUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.slug !== undefined && typeof input.slug !== 'string') errors.push('slug must be a string');
if (input.plan !== undefined && typeof input.plan !== 'string') errors.push('plan must be a string');
if (input.billingEmail !== undefined && typeof input.billingEmail !== 'string') errors.push('billingEmail must be a string');
if (input.ownerId !== undefined && typeof input.ownerId !== 'string') errors.push('ownerId must be a string');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidOrganizationCreate(input: OrganizationCreate): boolean {
        return validateOrganizationCreate(input).length === 0;
      }

      export function isValidOrganizationUpdate(input: OrganizationUpdate): boolean {
        return validateOrganizationUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownOrganizationField(field: string): boolean {
        return [
          'id',
  'name',
  'slug',
  'plan',
  'billingEmail',
  'ownerId',
  'createdAt',
        ].includes(field);
      }
