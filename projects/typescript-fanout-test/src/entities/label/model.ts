      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Label {
        id: string;
name: string;
color: string;
repositoryId: string;
description: string;
createdAt: Date | null;
      }

      export interface LabelCreate {
        name: string;
color: string;
repositoryId: string;
description: string;
      }

      export interface LabelUpdate {
        name?: string;
color?: string;
repositoryId?: string;
description?: string;
createdAt?: Date | null;
      }

      export const LabelFields = ['id', 'name', 'color', 'repositoryId', 'description', 'createdAt'] as const;
      export type LabelField = (typeof LabelFields)[number];

      /** Construct a new Label with sensible defaults for optional fields. */
      export function makeLabel(input: Partial<Label> & { id: string }): Label {
        return {
          id: input.id,
          name: input.name ?? '',
          color: input.color ?? '',
          repositoryId: input.repositoryId ?? '',
          description: input.description ?? '',
          createdAt: input.createdAt ?? null,
        } as Label;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateLabel(current: Label, patch: LabelUpdate): Label {
        const merged: Label = { ...current };
        for (const key of Object.keys(patch) as LabelField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickLabelFields(entity: Label, fields: LabelField[]): Partial<Label> {
        const out: Partial<Label> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneLabel(entity: Label): Label {
        return JSON.parse(JSON.stringify(entity)) as Label;
      }
