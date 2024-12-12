import { validate } from "./utils/validator";
import type { Message } from "./types/messages";

console.log("Content script loaded!");

const createAlertIcon = (
	violations: string[],
	className: string,
): HTMLElement => {
	const icon = document.createElement("div");
	icon.className = "design-checker-alert";
	icon.innerHTML = "⚠️";
	// インラインスタイル適用
	Object.assign(icon.style, {
		position: "absolute",
		padding: "4px",
		cursor: "pointer",
	});

	const tooltip = document.createElement("div");
	tooltip.className = "design-checker-tooltip";
	[className, ...violations].map((x, index) => {
		if (index === 0) {
			tooltip.appendChild(document.createElement("strong")).textContent = x;
			return;
		}
		tooltip.appendChild(document.createElement("p")).textContent = x;
	});
	// インラインスタイル適用
	Object.assign(tooltip.style, {
		visibility: "hidden",
		width: "240px",
		backgroundColor: "black",
		color: "#fff",
		textAlign: "center",
		borderRadius: "6px",
		padding: "5px 0",
		position: "absolute",
		zIndex: "1",
		bottom: "125%",
		left: "50%",
		marginLeft: "-60px",
		opacity: "0",
		transition: "opacity 0.3s",
	});

	// ホバー時の処理をJavaScriptで制御
	icon.addEventListener("mouseover", () => {
		tooltip.style.visibility = "visible";
		tooltip.style.opacity = "1";
	});
	icon.addEventListener("mouseout", () => {
		tooltip.style.visibility = "hidden";
		tooltip.style.opacity = "0";
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
						alertIcon.style.position = "absolute"; // positionをfixedに変更
						alertIcon.style.left = `${rect.left + scrollLeft}px`;
						alertIcon.style.top = `${rect.top + scrollTop}px`;
						alertIcon.style.zIndex = "9999";

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
