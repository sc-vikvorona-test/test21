      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface BillingAccount {
        id: string;
organizationId: string;
plan: string;
seats: number;
currency: string;
trialEndsAt: Date | null;
createdAt: Date | null;
      }

      export interface BillingAccountCreate {
        organizationId: string;
plan: string;
seats: number;
currency: string;
trialEndsAt: Date | null;
      }

      export interface BillingAccountUpdate {
        organizationId?: string;
plan?: string;
seats?: number;
currency?: string;
trialEndsAt?: Date | null;
createdAt?: Date | null;
      }

      export const BillingAccountFields = ['id', 'organizationId', 'plan', 'seats', 'currency', 'trialEndsAt', 'createdAt'] as const;
      export type BillingAccountField = (typeof BillingAccountFields)[number];

      /** Construct a new BillingAccount with sensible defaults for optional fields. */
      export function makeBillingAccount(input: Partial<BillingAccount> & { id: string }): BillingAccount {
        return {
          id: input.id,
          organizationId: input.organizationId ?? '',
          plan: input.plan ?? '',
          seats: input.seats ?? 0,
          currency: input.currency ?? '',
          trialEndsAt: input.trialEndsAt ?? null,
          createdAt: input.createdAt ?? null,
        } as BillingAccount;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateBillingAccount(current: BillingAccount, patch: BillingAccountUpdate): BillingAccount {
        const merged: BillingAccount = { ...current };
        for (const key of Object.keys(patch) as BillingAccountField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickBillingAccountFields(entity: BillingAccount, fields: BillingAccountField[]): Partial<BillingAccount> {
        const out: Partial<BillingAccount> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneBillingAccount(entity: BillingAccount): BillingAccount {
        return JSON.parse(JSON.stringify(entity)) as BillingAccount;
      }
