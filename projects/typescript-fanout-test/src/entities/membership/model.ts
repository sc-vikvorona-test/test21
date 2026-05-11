      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Membership {
        id: string;
userId: string;
teamId: string;
role: string;
joinedAt: Date | null;
      }

      export interface MembershipCreate {
        userId: string;
teamId: string;
role: string;
joinedAt: Date | null;
      }

      export interface MembershipUpdate {
        userId?: string;
teamId?: string;
role?: string;
joinedAt?: Date | null;
      }

      export const MembershipFields = ['id', 'userId', 'teamId', 'role', 'joinedAt'] as const;
      export type MembershipField = (typeof MembershipFields)[number];

      /** Construct a new Membership with sensible defaults for optional fields. */
      export function makeMembership(input: Partial<Membership> & { id: string }): Membership {
        return {
          id: input.id,
          userId: input.userId ?? '',
          teamId: input.teamId ?? '',
          role: input.role ?? '',
          joinedAt: input.joinedAt ?? null,
        } as Membership;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateMembership(current: Membership, patch: MembershipUpdate): Membership {
        const merged: Membership = { ...current };
        for (const key of Object.keys(patch) as MembershipField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickMembershipFields(entity: Membership, fields: MembershipField[]): Partial<Membership> {
        const out: Partial<Membership> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneMembership(entity: Membership): Membership {
        return JSON.parse(JSON.stringify(entity)) as Membership;
      }
