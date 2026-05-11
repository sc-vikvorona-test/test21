      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Milestone {
        id: string;
title: string;
repositoryId: string;
dueAt: Date | null;
state: string;
description: string;
createdAt: Date | null;
      }

      export interface MilestoneCreate {
        title: string;
repositoryId: string;
dueAt: Date | null;
state: string;
description: string;
      }

      export interface MilestoneUpdate {
        title?: string;
repositoryId?: string;
dueAt?: Date | null;
state?: string;
description?: string;
createdAt?: Date | null;
      }

      export const MilestoneFields = ['id', 'title', 'repositoryId', 'dueAt', 'state', 'description', 'createdAt'] as const;
      export type MilestoneField = (typeof MilestoneFields)[number];

      /** Construct a new Milestone with sensible defaults for optional fields. */
      export function makeMilestone(input: Partial<Milestone> & { id: string }): Milestone {
        return {
          id: input.id,
          title: input.title ?? '',
          repositoryId: input.repositoryId ?? '',
          dueAt: input.dueAt ?? null,
          state: input.state ?? '',
          description: input.description ?? '',
          createdAt: input.createdAt ?? null,
        } as Milestone;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateMilestone(current: Milestone, patch: MilestoneUpdate): Milestone {
        const merged: Milestone = { ...current };
        for (const key of Object.keys(patch) as MilestoneField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickMilestoneFields(entity: Milestone, fields: MilestoneField[]): Partial<Milestone> {
        const out: Partial<Milestone> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneMilestone(entity: Milestone): Milestone {
        return JSON.parse(JSON.stringify(entity)) as Milestone;
      }
