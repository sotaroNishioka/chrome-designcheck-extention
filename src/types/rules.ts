export interface DesignRule {
  padding?: string[];
  margin?: string[];
  fonts?: string[];
  fontSize?: string[];
  fontColor?: string[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: string[];
  paddingMultiple?: string[];
  marginMultiple?: string[];
  fontSizeMultiple?: string[];
  borderWidthMultiple?: string[];
}

export interface RuleInputConfig {
  id: keyof DesignRule;
  label: string;
  hasMultiple: boolean;
  multipleId?: keyof DesignRule;
}

export interface SavedRuleSet {
  name: string;
  rules: DesignRule;
}

export interface ValidationResult {
  element: HTMLElement;
  violations: string[];
}