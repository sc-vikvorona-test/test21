      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface DeployKey {
        id: string;
name: string;
repositoryId: string;
publicKey: string;
isReadOnly: string;
createdAt: Date | null;
      }

      export interface DeployKeyCreate {
        name: string;
repositoryId: string;
publicKey: string;
isReadOnly: string;
      }

      export interface DeployKeyUpdate {
        name?: string;
repositoryId?: string;
publicKey?: string;
isReadOnly?: string;
createdAt?: Date | null;
      }

      export const DeployKeyFields = ['id', 'name', 'repositoryId', 'publicKey', 'isReadOnly', 'createdAt'] as const;
      export type DeployKeyField = (typeof DeployKeyFields)[number];

      /** Construct a new DeployKey with sensible defaults for optional fields. */
      export function makeDeployKey(input: Partial<DeployKey> & { id: string }): DeployKey {
        return {
          id: input.id,
          name: input.name ?? '',
          repositoryId: input.repositoryId ?? '',
          publicKey: input.publicKey ?? '',
          isReadOnly: input.isReadOnly ?? '',
          createdAt: input.createdAt ?? null,
        } as DeployKey;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateDeployKey(current: DeployKey, patch: DeployKeyUpdate): DeployKey {
        const merged: DeployKey = { ...current };
        for (const key of Object.keys(patch) as DeployKeyField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickDeployKeyFields(entity: DeployKey, fields: DeployKeyField[]): Partial<DeployKey> {
        const out: Partial<DeployKey> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneDeployKey(entity: DeployKey): DeployKey {
        return JSON.parse(JSON.stringify(entity)) as DeployKey;
      }
