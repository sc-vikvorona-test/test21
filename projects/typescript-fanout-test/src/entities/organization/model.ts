      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Organization {
        id: string;
name: string;
slug: string;
plan: string;
billingEmail: string;
ownerId: string;
createdAt: Date | null;
      }

      export interface OrganizationCreate {
        name: string;
slug: string;
plan: string;
billingEmail: string;
ownerId: string;
      }

      export interface OrganizationUpdate {
        name?: string;
slug?: string;
plan?: string;
billingEmail?: string;
ownerId?: string;
createdAt?: Date | null;
      }

      export const OrganizationFields = ['id', 'name', 'slug', 'plan', 'billingEmail', 'ownerId', 'createdAt'] as const;
      export type OrganizationField = (typeof OrganizationFields)[number];

      /** Construct a new Organization with sensible defaults for optional fields. */
      export function makeOrganization(input: Partial<Organization> & { id: string }): Organization {
        return {
          id: input.id,
          name: input.name ?? '',
          slug: input.slug ?? '',
          plan: input.plan ?? '',
          billingEmail: input.billingEmail ?? '',
          ownerId: input.ownerId ?? '',
          createdAt: input.createdAt ?? null,
        } as Organization;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateOrganization(current: Organization, patch: OrganizationUpdate): Organization {
        const merged: Organization = { ...current };
        for (const key of Object.keys(patch) as OrganizationField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickOrganizationFields(entity: Organization, fields: OrganizationField[]): Partial<Organization> {
        const out: Partial<Organization> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneOrganization(entity: Organization): Organization {
        return JSON.parse(JSON.stringify(entity)) as Organization;
      }
