import type { DesignRule } from './rules';

export interface Message {
  type: 'CHECK_DESIGN';
  rules: DesignRule;
  enabled: boolean;
}