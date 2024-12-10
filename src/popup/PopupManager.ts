import { DesignRule, RuleInputConfig } from '../types/rules';
import { saveRuleSet, getRuleSets, deleteRuleSet } from '../utils/storage';
import { RuleInput } from './RuleInput';

export class PopupManager {
  private enableCheckingInput: HTMLInputElement;
  private rulesContainer: HTMLDivElement;
  private savedRuleSetsSelect: HTMLSelectElement;
  private currentRules: DesignRule = {};
  private ruleInputs: RuleInput[] = [];

  private static RULE_CONFIGS: RuleInputConfig[] = [
    { id: 'padding', label: 'Padding (px)', hasMultiple: true, multipleId: 'paddingMultiple' },
    { id: 'margin', label: 'Margin (px)', hasMultiple: true, multipleId: 'marginMultiple' },
    { id: 'fonts', label: 'Fonts', hasMultiple: false },
    { id: 'fontSize', label: 'Font Size (px)', hasMultiple: true, multipleId: 'fontSizeMultiple' },
    { id: 'fontColor', label: 'Font Color', hasMultiple: false },
    { id: 'backgroundColor', label: 'Background Color', hasMultiple: false },
    { id: 'borderColor', label: 'Border Color', hasMultiple: false },
    { id: 'borderWidth', label: 'Border Width (px)', hasMultiple: true, multipleId: 'borderWidthMultiple' }
  ];

  constructor() {
    this.enableCheckingInput = document.querySelector('#enableChecking') as HTMLInputElement;
    this.rulesContainer = document.querySelector('.rules-container') as HTMLDivElement;
    this.savedRuleSetsSelect = document.querySelector('#savedRuleSets') as HTMLSelectElement;

    this.initializeEventListeners();
    this.loadCurrentState();
    this.createRuleInputs();
    this.loadSavedRuleSets();
  }

  private initializeEventListeners(): void {
    this.enableCheckingInput.addEventListener('change', () => this.updateRules());

    document.querySelector('#saveRules')?.addEventListener('click', () => this.saveCurrentRules());
    document.querySelector('#loadRules')?.addEventListener('click', () => this.loadSelectedRuleSet());
    document.querySelector('#deleteRules')?.addEventListener('click', () => this.deleteSelectedRuleSet());
    document.querySelector('#exportRules')?.addEventListener('click', () => this.exportRules());
    document.querySelector('#importRules')?.addEventListener('click', () => this.importRules());
  }

  private async loadCurrentState(): Promise<void> {
    const { currentRules = {}, isEnabled = false } = await chrome.storage.sync.get([
      'currentRules',
      'isEnabled'
    ]);

    this.currentRules = currentRules;
    this.enableCheckingInput.checked = isEnabled;
  }

  private createRuleInputs(): void {
    PopupManager.RULE_CONFIGS.forEach(config => {
      const ruleInput = new RuleInput(
        config,
        this.currentRules,
        () => this.updateRules()
      );
      this.ruleInputs.push(ruleInput);

      // ラベル要素を作成
      const label = document.createElement('label');
      label.textContent = config.label;
      label.setAttribute('for', config.id);

      // 入力要素をラベルと一緒にコンテナに追加
      const ruleWrapper = document.createElement('div');
      ruleWrapper.classList.add('rule-wrapper');
      ruleWrapper.appendChild(label);
      ruleWrapper.appendChild(ruleInput.getElement());

      this.rulesContainer.appendChild(ruleWrapper);
    });
  }


  private async loadSavedRuleSets(): Promise<void> {
    const ruleSets = await getRuleSets();
    this.savedRuleSetsSelect.innerHTML = '';

    ruleSets.forEach(({ name }) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.savedRuleSetsSelect.appendChild(option);
    });
  }

  private async updateRules(): Promise<void> {
    const newRules: DesignRule = {};

    this.ruleInputs.forEach((ruleInput, index) => {
      const config = PopupManager.RULE_CONFIGS[index];
      const { value, multiple } = ruleInput.getValue();

      if (value) {
        // @ts-ignore
        newRules[config.id] = value;
      }

      if (multiple && config.multipleId) {
        // @ts-ignore
        newRules[config.multipleId] = multiple;
      }
    });

    this.currentRules = newRules;
    await chrome.storage.sync.set({
      currentRules: newRules,
      isEnabled: this.enableCheckingInput.checked
    });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'UPDATE_RULES',
        rules: newRules,
        enabled: this.enableCheckingInput.checked
      });
    }
  }

  private async saveCurrentRules(): Promise<void> {
    const name = prompt('Enter a name for this rule set:');
    if (name) {
      await saveRuleSet(name, this.currentRules);
      await this.loadSavedRuleSets();
    }
  }

  private async loadSelectedRuleSet(): Promise<void> {
    const name = this.savedRuleSetsSelect.value;
    const ruleSets = await getRuleSets();
    const ruleSet = ruleSets.find(set => set.name === name);

    if (ruleSet) {
      this.currentRules = ruleSet.rules;
      await this.updateRules();
      await this.loadCurrentState();
    }
  }

  private async deleteSelectedRuleSet(): Promise<void> {
    const name = this.savedRuleSetsSelect.value;
    if (name && confirm(`Delete rule set "${name}"?`)) {
      await deleteRuleSet(name);
      await this.loadSavedRuleSets();
    }
  }

  private exportRules(): void {
    const json = JSON.stringify(this.currentRules, null, 2);
    navigator.clipboard.writeText(json);
    alert('Rules copied to clipboard!');
  }

  private async importRules(): Promise<void> {
    const json = prompt('Paste rules JSON:');
    if (json) {
      try {
        this.currentRules = JSON.parse(json);
        await this.updateRules();
        await this.loadCurrentState();
      } catch (error) {
        alert('Invalid JSON format!');
      }
    }
  }
}