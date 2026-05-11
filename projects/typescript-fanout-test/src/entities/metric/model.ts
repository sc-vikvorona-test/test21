      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Metric {
        id: string;
name: string;
unit: string;
quantity: number;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface MetricCreate {
        name: string;
unit: string;
quantity: number;
metadata: Record<string, unknown>;
recordedAt: Date | null;
      }

      export interface MetricUpdate {
        name?: string;
unit?: string;
quantity?: number;
metadata?: Record<string, unknown>;
recordedAt?: Date | null;
      }

      export const MetricFields = ['id', 'name', 'unit', 'quantity', 'metadata', 'recordedAt'] as const;
      export type MetricField = (typeof MetricFields)[number];

      /** Construct a new Metric with sensible defaults for optional fields. */
      export function makeMetric(input: Partial<Metric> & { id: string }): Metric {
        return {
          id: input.id,
          name: input.name ?? '',
          unit: input.unit ?? '',
          quantity: input.quantity ?? 0,
          metadata: input.metadata ?? {},
          recordedAt: input.recordedAt ?? null,
        } as Metric;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateMetric(current: Metric, patch: MetricUpdate): Metric {
        const merged: Metric = { ...current };
        for (const key of Object.keys(patch) as MetricField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickMetricFields(entity: Metric, fields: MetricField[]): Partial<Metric> {
        const out: Partial<Metric> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneMetric(entity: Metric): Metric {
        return JSON.parse(JSON.stringify(entity)) as Metric;
      }
