      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Environment {
        id: string;
name: string;
projectId: string;
protectionRule: string;
approverIds: string[];
createdAt: Date | null;
      }

      export interface EnvironmentCreate {
        name: string;
projectId: string;
protectionRule: string;
approverIds: string[];
      }

      export interface EnvironmentUpdate {
        name?: string;
projectId?: string;
protectionRule?: string;
approverIds?: string[];
createdAt?: Date | null;
      }

      export const EnvironmentFields = ['id', 'name', 'projectId', 'protectionRule', 'approverIds', 'createdAt'] as const;
      export type EnvironmentField = (typeof EnvironmentFields)[number];

      /** Construct a new Environment with sensible defaults for optional fields. */
      export function makeEnvironment(input: Partial<Environment> & { id: string }): Environment {
        return {
          id: input.id,
          name: input.name ?? '',
          projectId: input.projectId ?? '',
          protectionRule: input.protectionRule ?? '',
          approverIds: input.approverIds ?? [],
          createdAt: input.createdAt ?? null,
        } as Environment;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateEnvironment(current: Environment, patch: EnvironmentUpdate): Environment {
        const merged: Environment = { ...current };
        for (const key of Object.keys(patch) as EnvironmentField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickEnvironmentFields(entity: Environment, fields: EnvironmentField[]): Partial<Environment> {
        const out: Partial<Environment> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneEnvironment(entity: Environment): Environment {
        return JSON.parse(JSON.stringify(entity)) as Environment;
      }
