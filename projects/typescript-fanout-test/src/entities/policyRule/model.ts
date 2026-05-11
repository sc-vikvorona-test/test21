      // Synthetic fixture — generated for split-review fan-out testing.
      // Not derived from any external codebase.

      export interface PolicyRule {
        id: string;
policyId: string;
condition: string;
action: string;
priority: string;
active: boolean;
      }

      export interface PolicyRuleCreate {
        policyId: string;
condition: string;
action: string;
priority: string;
active: boolean;
      }

      export interface PolicyRuleUpdate {
        policyId?: string;
condition?: string;
action?: string;
priority?: string;
active?: boolean;
      }

      export const PolicyRuleFields = ['id', 'policyId', 'condition', 'action', 'priority', 'active'] as const;
      export type PolicyRuleField = (typeof PolicyRuleFields)[number];

      /** Construct a new PolicyRule with sensible defaults for optional fields. */
      export function makePolicyRule(input: Partial<PolicyRule> & { id: string }): PolicyRule {
        return {
          id: input.id,
          policyId: input.policyId ?? '',
          condition: input.condition ?? '',
          action: input.action ?? '',
          priority: input.priority ?? '',
          active: input.active ?? false,
        } as PolicyRule;
      }

      /** Shallow merge for partial updates. Reject identifier mutation. */
      export function updatePolicyRule(current: PolicyRule, patch: PolicyRuleUpdate): PolicyRule {
        const merged: PolicyRule = { ...current };
        for (const key of Object.keys(patch) as PolicyRuleField[]) {
          if (key === 'id') continue;
          const value = (patch as Record<string, unknown>)[key];
          if (value === undefined) continue;
          (merged as Record<string, unknown>)[key] = value;
        }
        return merged;
      }

      export function pickPolicyRuleFields(entity: PolicyRule, fields: PolicyRuleField[]): Partial<PolicyRule> {
        const out: Partial<PolicyRule> = {};
        for (const f of fields) {
          (out as Record<string, unknown>)[f] = (entity as Record<string, unknown>)[f];
        }
        return out;
      }

      export function clonePolicyRule(entity: PolicyRule): PolicyRule {
        return JSON.parse(JSON.stringify(entity)) as PolicyRule;
      }
