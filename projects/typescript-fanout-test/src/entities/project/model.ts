      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Project {
        id: string;
name: string;
workspaceId: string;
language: string;
status: string;
archivedAt: Date | null;
createdAt: Date | null;
      }

      export interface ProjectCreate {
        name: string;
workspaceId: string;
language: string;
status: string;
archivedAt: Date | null;
      }

      export interface ProjectUpdate {
        name?: string;
workspaceId?: string;
language?: string;
status?: string;
archivedAt?: Date | null;
createdAt?: Date | null;
      }

      export const ProjectFields = ['id', 'name', 'workspaceId', 'language', 'status', 'archivedAt', 'createdAt'] as const;
      export type ProjectField = (typeof ProjectFields)[number];

      /** Construct a new Project with sensible defaults for optional fields. */
      export function makeProject(input: Partial<Project> & { id: string }): Project {
        return {
          id: input.id,
          name: input.name ?? '',
          workspaceId: input.workspaceId ?? '',
          language: input.language ?? '',
          status: input.status ?? '',
          archivedAt: input.archivedAt ?? null,
          createdAt: input.createdAt ?? null,
        } as Project;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateProject(current: Project, patch: ProjectUpdate): Project {
        const merged: Project = { ...current };
        for (const key of Object.keys(patch) as ProjectField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickProjectFields(entity: Project, fields: ProjectField[]): Partial<Project> {
        const out: Partial<Project> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneProject(entity: Project): Project {
        return JSON.parse(JSON.stringify(entity)) as Project;
      }
