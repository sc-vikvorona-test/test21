      import type { PolicyRuleCreate, PolicyRuleUpdate } from './model';

      export function validatePolicyRuleCreate(input: PolicyRuleCreate): string[] {
        const errors: string[] = [];
        if (input.policyId !== undefined && typeof input.policyId !== 'string') errors.push('policyId must be a string');
if (input.condition !== undefined && typeof input.condition !== 'string') errors.push('condition must be a string');
if (input.action !== undefined && typeof input.action !== 'string') errors.push('action must be a string');
if (input.priority !== undefined && typeof input.priority !== 'string') errors.push('priority must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
        return errors;
      }

      export function validatePolicyRuleUpdate(input: PolicyRuleUpdate): string[] {
        const errors: string[] = [];
        if (input.policyId !== undefined && typeof input.policyId !== 'string') errors.push('policyId must be a string');
if (input.condition !== undefined && typeof input.condition !== 'string') errors.push('condition must be a string');
if (input.action !== undefined && typeof input.action !== 'string') errors.push('action must be a string');
if (input.priority !== undefined && typeof input.priority !== 'string') errors.push('priority must be a string');
if (input.active !== undefined && typeof input.active !== 'boolean') errors.push('active must be a boolean');
        return errors;
      }

      export function isValidPolicyRuleCreate(input: PolicyRuleCreate): boolean {
        return validatePolicyRuleCreate(input).length === 0;
      }

      export function isValidPolicyRuleUpdate(input: PolicyRuleUpdate): boolean {
        return validatePolicyRuleUpdate(input).length === 0;
      }

      /** Light field-name guard for query parameters. */
      export function isKnownPolicyRuleField(field: string): boolean {
        return [
          'id',
  'policyId',
  'condition',
  'action',
  'priority',
  'active',
        ].includes(field);
      }
