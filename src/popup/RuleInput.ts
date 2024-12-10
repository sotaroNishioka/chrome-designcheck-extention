import { DesignRule, RuleInputConfig } from '../types/rules';

export class RuleInput {
  private container: HTMLDivElement;
  private valueInput: HTMLInputElement;
  private multipleInput?: HTMLInputElement;

  constructor(
    config: RuleInputConfig,
    initialValues: DesignRule,
    onChange: () => void
  ) {
    this.container = document.createElement('div');
    this.container.className = 'rule-group';

    this.valueInput = this.createValueInput(config, initialValues, onChange);

    if (config.hasMultiple && config.multipleId) {
      this.multipleInput = this.createMultipleInput(config, initialValues, onChange);
      this.container.appendChild(this.multipleInput);
    }

    this.container.appendChild(this.valueInput);
  }

  private createValueInput(
    config: RuleInputConfig,
    initialValues: DesignRule,
    onChange: () => void
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = config.id;
    input.className = 'rule-input';
    input.placeholder = `${config.label} (comma-separated)`;

    const value = initialValues[config.id];
    input.value = Array.isArray(value) ? value.join(',') : '';

    input.addEventListener('change', onChange);
    return input;
  }

  private createMultipleInput(
    config: RuleInputConfig,
    initialValues: DesignRule,
    onChange: () => void
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = config.multipleId as string;
    input.className = 'rule-input';
    input.placeholder = `${config.label} multiple`;

    const value = initialValues[config.multipleId as keyof DesignRule];
    input.value = typeof value === 'number' ? value.toString() : '';

    input.addEventListener('change', onChange);
    return input;
  }

  public getElement(): HTMLDivElement {
    return this.container;
  }

  public getValue(): { value?: string[]; multiple?: number } {
    const result: { value?: string[]; multiple?: number } = {};

    const valueText = this.valueInput.value.trim();
    if (valueText) {
      result.value = valueText.split(',').map(v => v.trim());
    }

    if (this.multipleInput) {
      const multipleValue = this.multipleInput.value.trim();
      if (multipleValue) {
        result.multiple = parseInt(multipleValue, 10);
      }
    }

    return result;
  }

  // setValue: 入力値を設定するメソッド
  public setValue(value: string | string[], multiple?: number): void {
    if (Array.isArray(value)) {
      this.valueInput.value = value.join(','); // 配列をカンマ区切りの文字列に変換
    } else {
      this.valueInput.value = value;
    }

    if (this.multipleInput && multiple !== undefined) {
      this.multipleInput.value = multiple.toString();
    }
  }
}
