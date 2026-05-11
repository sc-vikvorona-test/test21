      import type { ChannelCreate, ChannelUpdate } from './model';

      export function validateChannelCreate(input: ChannelCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.workspaceId !== undefined && typeof input.workspaceId !== 'string') errors.push('workspaceId must be a string');
if (input.visibility !== undefined && typeof input.visibility !== 'string') errors.push('visibility must be a string');
if (input.memberCount !== undefined && typeof input.memberCount !== 'number') errors.push('memberCount must be a number');
if (input.memberCount !== undefined && (input.memberCount as number) < 0) errors.push('memberCount must be non-negative');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function validateChannelUpdate(input: ChannelUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.workspaceId !== undefined && typeof input.workspaceId !== 'string') errors.push('workspaceId must be a string');
if (input.visibility !== undefined && typeof input.visibility !== 'string') errors.push('visibility must be a string');
if (input.memberCount !== undefined && typeof input.memberCount !== 'number') errors.push('memberCount must be a number');
if (input.memberCount !== undefined && (input.memberCount as number) < 0) errors.push('memberCount must be non-negative');
if (input.createdAt !== undefined && input.createdAt !== null && !(input.createdAt instanceof Date)) errors.push('createdAt must be a Date or null');
        return errors;
      }

      export function isValidChannelCreate(input: ChannelCreate): boolean {
        return validateChannelCreate(input).length === 0;
      }

      export function isValidChannelUpdate(input: ChannelUpdate): boolean {
        return validateChannelUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownChannelField(field: string): boolean {
        return [
          'id',
  'name',
  'workspaceId',
  'visibility',
  'memberCount',
  'createdAt',
        ].includes(field);
      }
