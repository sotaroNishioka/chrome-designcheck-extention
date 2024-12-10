import type { DesignRule } from './rules';

export interface Message {
  type: 'UPDATE_RULES';
  rules: DesignRule;
  enabled: boolean;
}