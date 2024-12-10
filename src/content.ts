import { StyleValidator } from './utils/validator';
import type { Message } from './types/messages';

let currentValidator: StyleValidator | null = null;
let isCheckingEnabled = false;

const createAlertIcon = (violations: string[]): HTMLElement => {
  const icon = document.createElement('div');
  icon.className = 'design-checker-alert';
  icon.innerHTML = '⚠️';
  
  const tooltip = document.createElement('div');
  tooltip.className = 'design-checker-tooltip';
  tooltip.textContent = violations.join('\n');
  
  icon.appendChild(tooltip);
  return icon;
};

const checkElement = (element: HTMLElement) => {
  if (!currentValidator || !isCheckingEnabled) return;
  
  const result = currentValidator.validate(element);
  if (result.violations.length > 0) {
    const alertIcon = createAlertIcon(result.violations);
    element.style.position = 'relative';
    element.appendChild(alertIcon);
  }
};

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'UPDATE_RULES') {
    currentValidator = new StyleValidator(message.rules);
    isCheckingEnabled = message.enabled;
    
    if (isCheckingEnabled) {
      document.querySelectorAll('*').forEach((element) => {
        if (element instanceof HTMLElement) {
          checkElement(element);
        }
      });
    } else {
      document.querySelectorAll('.design-checker-alert').forEach(el => el.remove());
    }
  }
});