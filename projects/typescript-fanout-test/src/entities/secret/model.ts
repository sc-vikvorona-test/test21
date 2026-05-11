      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Secret {
        id: string;
name: string;
ownerId: string;
valueRef: string;
rotatedAt: Date | null;
expiresAt: Date | null;
createdAt: Date | null;
      }

      export interface SecretCreate {
        name: string;
ownerId: string;
valueRef: string;
rotatedAt: Date | null;
expiresAt: Date | null;
      }

      export interface SecretUpdate {
        name?: string;
ownerId?: string;
valueRef?: string;
rotatedAt?: Date | null;
expiresAt?: Date | null;
createdAt?: Date | null;
      }

      export const SecretFields = ['id', 'name', 'ownerId', 'valueRef', 'rotatedAt', 'expiresAt', 'createdAt'] as const;
      export type SecretField = (typeof SecretFields)[number];

      /** Construct a new Secret with sensible defaults for optional fields. */
      export function makeSecret(input: Partial<Secret> & { id: string }): Secret {
        return {
          id: input.id,
          name: input.name ?? '',
          ownerId: input.ownerId ?? '',
          valueRef: input.valueRef ?? '',
          rotatedAt: input.rotatedAt ?? null,
          expiresAt: input.expiresAt ?? null,
          createdAt: input.createdAt ?? null,
        } as Secret;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateSecret(current: Secret, patch: SecretUpdate): Secret {
        const merged: Secret = { ...current };
        for (const key of Object.keys(patch) as SecretField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickSecretFields(entity: Secret, fields: SecretField[]): Partial<Secret> {
        const out: Partial<Secret> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneSecret(entity: Secret): Secret {
        return JSON.parse(JSON.stringify(entity)) as Secret;
      }
