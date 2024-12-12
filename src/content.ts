import { validate } from './utils/validator';
import type { Message } from './types/messages';

console.log('Content script loaded!');

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

// メッセージリスナーの修正
chrome.runtime.onMessage.addListener((message: Message) => {
  console.log('Message received:', message);
  // メッセージが 'CHECK_DESIGN' タイプであることを確認
  if (message.type === 'CHECK_DESIGN') {
    // ルールが存在するかどうかを確認
    if (message.rules) {
      // すべてのHTML要素をループしてデザインチェックを実行
      for (const element of document.querySelectorAll('*')) {
        if (element instanceof HTMLElement) {
          // バリデーションの実行
          const result = validate(element, message.rules);

          console.log('Validation result:', result.violations.length);
          // バリデーション違反がある場合
          if (result.violations.length > 0) {
            const alertIcon = createAlertIcon(result.violations);

            // 警告アイコンを要素に追加
            element.style.position = 'relative';
            element.appendChild(alertIcon);
          }
        }
      }
    } else {
      console.error('Rules are missing in the message:', message);
    }
  }
  return true;
});
