import { validate } from "./utils/validator";
import type { Message } from "./types/messages";
import "./styles/content.css";

console.log("Content script loaded!");

const createAlertIcon = (
	violations: string[],
	className: string,
): HTMLElement => {
	const icon = document.createElement("div");
	icon.className = "design-checker-alert";
	icon.innerHTML = "⚠️";

	const tooltip = document.createElement("div");
	tooltip.className = "design-checker-tooltip";
	[className, ...violations].map((x, index) => {
		if (index === 0) {
			tooltip.appendChild(document.createElement("strong")).textContent = x;
			return;
		}
		tooltip.appendChild(document.createElement("p")).textContent = x;
	});

	icon.appendChild(tooltip);
	return icon;
};

// メッセージリスナーの修正
chrome.runtime.onMessage.addListener((message: Message) => {
	console.log("Message received:", message);
	// メッセージが 'CHECK_DESIGN' タイプであることを確認
	if (message.type === "CHECK_DESIGN") {
		// ルールが存在するかどうかを確認
		if (message.rules) {
			// すべてのHTML要素をループしてデザインチェックを実行
			for (const element of document.querySelectorAll("*")) {
				if (element instanceof HTMLElement) {
					// バリデーションの実行
					const result = validate(element, message.rules);
					// バリデーション違反がある場合
					if (result.violations.length > 0) {
						const className = element.className;
						const alertIcon = createAlertIcon(result.violations, className);
						const rect = element.getBoundingClientRect();
						// スクロール位置を考慮した絶対位置の計算
						const scrollTop = window.scrollY;
						const scrollLeft = window.scrollX;
						alertIcon.style.left = `${rect.left + scrollLeft}px`;
						alertIcon.style.top = `${rect.top + scrollTop}px`;

						// ツールチップ位置の調整（最上部/最下部200px以内を考慮）
						if (rect.left < window.innerWidth / 2) {
							// 画面左側
							if (rect.top > 200) {
								alertIcon.classList.add("tooltip-top-right");
							} else {
								alertIcon.classList.add("tooltip-bottom-right");
							}
						} else {
							// 画面右側
							if (rect.top > 200) {
								alertIcon.classList.add("tooltip-top-left");
							} else {
								alertIcon.classList.add("tooltip-bottom-left");
							}
						}
						// body直下にアラートアイコンを追加
						document.body.appendChild(alertIcon);
					}
				}
			}
		} else {
			console.error("Rules are missing in the message:", message);
		}
	}
	return true;
});
