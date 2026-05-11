      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface User {
        id: string;
email: string;
displayName: string;
passwordHash: string;
role: string;
verified: boolean;
createdAt: Date | null;
      }

      export interface UserCreate {
        email: string;
displayName: string;
passwordHash: string;
role: string;
verified: boolean;
      }

      export interface UserUpdate {
        email?: string;
displayName?: string;
passwordHash?: string;
role?: string;
verified?: boolean;
createdAt?: Date | null;
      }

      export const UserFields = ['id', 'email', 'displayName', 'passwordHash', 'role', 'verified', 'createdAt'] as const;
      export type UserField = (typeof UserFields)[number];

      /** Construct a new User with sensible defaults for optional fields. */
      export function makeUser(input: Partial<User> & { id: string }): User {
        return {
          id: input.id,
          email: input.email ?? '',
          displayName: input.displayName ?? '',
          passwordHash: input.passwordHash ?? '',
          role: input.role ?? '',
          verified: input.verified ?? false,
          createdAt: input.createdAt ?? null,
        } as User;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateUser(current: User, patch: UserUpdate): User {
        const merged: User = { ...current };
        for (const key of Object.keys(patch) as UserField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickUserFields(entity: User, fields: UserField[]): Partial<User> {
        const out: Partial<User> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneUser(entity: User): User {
        return JSON.parse(JSON.stringify(entity)) as User;
      }
