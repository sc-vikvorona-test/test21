      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Artifact {
        id: string;
pipelineRunId: string;
name: string;
contentType: string;
amountCents: number;
createdAt: Date | null;
expiresAt: Date | null;
      }

      export interface ArtifactCreate {
        pipelineRunId: string;
name: string;
contentType: string;
amountCents: number;
expiresAt: Date | null;
      }

      export interface ArtifactUpdate {
        pipelineRunId?: string;
name?: string;
contentType?: string;
amountCents?: number;
createdAt?: Date | null;
expiresAt?: Date | null;
      }

      export const ArtifactFields = ['id', 'pipelineRunId', 'name', 'contentType', 'amountCents', 'createdAt', 'expiresAt'] as const;
      export type ArtifactField = (typeof ArtifactFields)[number];

      /** Construct a new Artifact with sensible defaults for optional fields. */
      export function makeArtifact(input: Partial<Artifact> & { id: string }): Artifact {
        return {
          id: input.id,
          pipelineRunId: input.pipelineRunId ?? '',
          name: input.name ?? '',
          contentType: input.contentType ?? '',
          amountCents: input.amountCents ?? 0,
          createdAt: input.createdAt ?? null,
          expiresAt: input.expiresAt ?? null,
        } as Artifact;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateArtifact(current: Artifact, patch: ArtifactUpdate): Artifact {
        const merged: Artifact = { ...current };
        for (const key of Object.keys(patch) as ArtifactField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickArtifactFields(entity: Artifact, fields: ArtifactField[]): Partial<Artifact> {
        const out: Partial<Artifact> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneArtifact(entity: Artifact): Artifact {
        return JSON.parse(JSON.stringify(entity)) as Artifact;
      }
