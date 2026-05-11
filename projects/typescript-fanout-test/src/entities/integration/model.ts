      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Integration {
        id: string;
name: string;
kind: string;
ownerId: string;
active: boolean;
configRef: string;
createdAt: Date | null;
      }

      export interface IntegrationCreate {
        name: string;
kind: string;
ownerId: string;
active: boolean;
configRef: string;
      }

      export interface IntegrationUpdate {
        name?: string;
kind?: string;
ownerId?: string;
active?: boolean;
configRef?: string;
createdAt?: Date | null;
      }

      export const IntegrationFields = ['id', 'name', 'kind', 'ownerId', 'active', 'configRef', 'createdAt'] as const;
      export type IntegrationField = (typeof IntegrationFields)[number];

      /** Construct a new Integration with sensible defaults for optional fields. */
      export function makeIntegration(input: Partial<Integration> & { id: string }): Integration {
        return {
          id: input.id,
          name: input.name ?? '',
          kind: input.kind ?? '',
          ownerId: input.ownerId ?? '',
          active: input.active ?? false,
          configRef: input.configRef ?? '',
          createdAt: input.createdAt ?? null,
        } as Integration;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateIntegration(current: Integration, patch: IntegrationUpdate): Integration {
        const merged: Integration = { ...current };
        for (const key of Object.keys(patch) as IntegrationField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickIntegrationFields(entity: Integration, fields: IntegrationField[]): Partial<Integration> {
        const out: Partial<Integration> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneIntegration(entity: Integration): Integration {
        return JSON.parse(JSON.stringify(entity)) as Integration;
      }
