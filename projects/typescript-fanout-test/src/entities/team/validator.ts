      import type { TeamCreate, TeamUpdate } from './model';

      export function validateTeamCreate(input: TeamCreate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.organizationId !== undefined && typeof input.organizationId !== 'string') errors.push('organizationId must be a string');
if (input.slug !== undefined && typeof input.slug !== 'string') errors.push('slug must be a string');
if (input.parentTeamId !== undefined && typeof input.parentTeamId !== 'string') errors.push('parentTeamId must be a string');
if (input.memberCount !== undefined && typeof input.memberCount !== 'number') errors.push('memberCount must be a number');
if (input.memberCount !== undefined && (input.memberCount as number) < 0) errors.push('memberCount must be non-negative');
        return errors;
      }

      export function validateTeamUpdate(input: TeamUpdate): string[] {
        const errors: string[] = [];
        if (input.name !== undefined && typeof input.name !== 'string') errors.push('name must be a string');
if (input.organizationId !== undefined && typeof input.organizationId !== 'string') errors.push('organizationId must be a string');
if (input.slug !== undefined && typeof input.slug !== 'string') errors.push('slug must be a string');
if (input.parentTeamId !== undefined && typeof input.parentTeamId !== 'string') errors.push('parentTeamId must be a string');
if (input.memberCount !== undefined && typeof input.memberCount !== 'number') errors.push('memberCount must be a number');
if (input.memberCount !== undefined && (input.memberCount as number) < 0) errors.push('memberCount must be non-negative');
        return errors;
      }

      export function isValidTeamCreate(input: TeamCreate): boolean {
        return validateTeamCreate(input).length === 0;
      }

      export function isValidTeamUpdate(input: TeamUpdate): boolean {
        return validateTeamUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownTeamField(field: string): boolean {
        return [
          'id',
  'name',
  'organizationId',
  'slug',
  'parentTeamId',
  'memberCount',
        ].includes(field);
      }
