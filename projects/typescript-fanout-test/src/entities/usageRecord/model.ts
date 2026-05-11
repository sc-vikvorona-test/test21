      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface UsageRecord {
        id: string;
billingAccountId: string;
metric: string;
quantity: number;
recordedAt: Date | null;
      }

      export interface UsageRecordCreate {
        billingAccountId: string;
metric: string;
quantity: number;
recordedAt: Date | null;
      }

      export interface UsageRecordUpdate {
        billingAccountId?: string;
metric?: string;
quantity?: number;
recordedAt?: Date | null;
      }

      export const UsageRecordFields = ['id', 'billingAccountId', 'metric', 'quantity', 'recordedAt'] as const;
      export type UsageRecordField = (typeof UsageRecordFields)[number];

      /** Construct a new UsageRecord with sensible defaults for optional fields. */
      export function makeUsageRecord(input: Partial<UsageRecord> & { id: string }): UsageRecord {
        return {
          id: input.id,
          billingAccountId: input.billingAccountId ?? '',
          metric: input.metric ?? '',
          quantity: input.quantity ?? 0,
          recordedAt: input.recordedAt ?? null,
        } as UsageRecord;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateUsageRecord(current: UsageRecord, patch: UsageRecordUpdate): UsageRecord {
        const merged: UsageRecord = { ...current };
        for (const key of Object.keys(patch) as UsageRecordField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickUsageRecordFields(entity: UsageRecord, fields: UsageRecordField[]): Partial<UsageRecord> {
        const out: Partial<UsageRecord> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneUsageRecord(entity: UsageRecord): UsageRecord {
        return JSON.parse(JSON.stringify(entity)) as UsageRecord;
      }
