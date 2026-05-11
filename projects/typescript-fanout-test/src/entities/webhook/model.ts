      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Webhook {
        id: string;
url: string;
secret: string;
events: string[];
ownerId: string;
active: boolean;
createdAt: Date | null;
      }

      export interface WebhookCreate {
        url: string;
secret: string;
events: string[];
ownerId: string;
active: boolean;
      }

      export interface WebhookUpdate {
        url?: string;
secret?: string;
events?: string[];
ownerId?: string;
active?: boolean;
createdAt?: Date | null;
      }

      export const WebhookFields = ['id', 'url', 'secret', 'events', 'ownerId', 'active', 'createdAt'] as const;
      export type WebhookField = (typeof WebhookFields)[number];

      /** Construct a new Webhook with sensible defaults for optional fields. */
      export function makeWebhook(input: Partial<Webhook> & { id: string }): Webhook {
        return {
          id: input.id,
          url: input.url ?? '',
          secret: input.secret ?? '',
          events: input.events ?? [],
          ownerId: input.ownerId ?? '',
          active: input.active ?? false,
          createdAt: input.createdAt ?? null,
        } as Webhook;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateWebhook(current: Webhook, patch: WebhookUpdate): Webhook {
        const merged: Webhook = { ...current };
        for (const key of Object.keys(patch) as WebhookField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickWebhookFields(entity: Webhook, fields: WebhookField[]): Partial<Webhook> {
        const out: Partial<Webhook> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneWebhook(entity: Webhook): Webhook {
        return JSON.parse(JSON.stringify(entity)) as Webhook;
      }
