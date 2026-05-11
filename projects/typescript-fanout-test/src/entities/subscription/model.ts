      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Subscription {
        id: string;
billingAccountId: string;
plan: string;
interval: string;
renewsAt: Date | null;
canceledAt: Date | null;
      }

      export interface SubscriptionCreate {
        billingAccountId: string;
plan: string;
interval: string;
renewsAt: Date | null;
canceledAt: Date | null;
      }

      export interface SubscriptionUpdate {
        billingAccountId?: string;
plan?: string;
interval?: string;
renewsAt?: Date | null;
canceledAt?: Date | null;
      }

      export const SubscriptionFields = ['id', 'billingAccountId', 'plan', 'interval', 'renewsAt', 'canceledAt'] as const;
      export type SubscriptionField = (typeof SubscriptionFields)[number];

      /** Construct a new Subscription with sensible defaults for optional fields. */
      export function makeSubscription(input: Partial<Subscription> & { id: string }): Subscription {
        return {
          id: input.id,
          billingAccountId: input.billingAccountId ?? '',
          plan: input.plan ?? '',
          interval: input.interval ?? '',
          renewsAt: input.renewsAt ?? null,
          canceledAt: input.canceledAt ?? null,
        } as Subscription;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateSubscription(current: Subscription, patch: SubscriptionUpdate): Subscription {
        const merged: Subscription = { ...current };
        for (const key of Object.keys(patch) as SubscriptionField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickSubscriptionFields(entity: Subscription, fields: SubscriptionField[]): Partial<Subscription> {
        const out: Partial<Subscription> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneSubscription(entity: Subscription): Subscription {
        return JSON.parse(JSON.stringify(entity)) as Subscription;
      }
