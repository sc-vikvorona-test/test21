      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface Certificate {
        id: string;
subject: string;
issuer: string;
notBeforeAt: Date | null;
notAfterAt: Date | null;
fingerprint: string;
createdAt: Date | null;
      }

      export interface CertificateCreate {
        subject: string;
issuer: string;
notBeforeAt: Date | null;
notAfterAt: Date | null;
fingerprint: string;
      }

      export interface CertificateUpdate {
        subject?: string;
issuer?: string;
notBeforeAt?: Date | null;
notAfterAt?: Date | null;
fingerprint?: string;
createdAt?: Date | null;
      }

      export const CertificateFields = ['id', 'subject', 'issuer', 'notBeforeAt', 'notAfterAt', 'fingerprint', 'createdAt'] as const;
      export type CertificateField = (typeof CertificateFields)[number];

      /** Construct a new Certificate with sensible defaults for optional fields. */
      export function makeCertificate(input: Partial<Certificate> & { id: string }): Certificate {
        return {
          id: input.id,
          subject: input.subject ?? '',
          issuer: input.issuer ?? '',
          notBeforeAt: input.notBeforeAt ?? null,
          notAfterAt: input.notAfterAt ?? null,
          fingerprint: input.fingerprint ?? '',
          createdAt: input.createdAt ?? null,
        } as Certificate;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updateCertificate(current: Certificate, patch: CertificateUpdate): Certificate {
        const merged: Certificate = { ...current };
        for (const key of Object.keys(patch) as CertificateField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickCertificateFields(entity: Certificate, fields: CertificateField[]): Partial<Certificate> {
        const out: Partial<Certificate> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function cloneCertificate(entity: Certificate): Certificate {
        return JSON.parse(JSON.stringify(entity)) as Certificate;
      }
