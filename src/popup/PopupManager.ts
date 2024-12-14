import { deleteRuleSet, getRuleSets, saveRuleSet } from "../utils/storage";

// 現在のルールを保持する変数
let currentRules: Record<string, string | string[]> = {};

// DOM要素をキャッシュする変数
const rulesContainer = document.querySelector(
	".rules-container",
) as HTMLDivElement;
const savedRuleSetsSelect = document.querySelector(
	"#savedRuleSets",
) as HTMLSelectElement;

export function initializePopup() {
	loadCurrentState();
	loadSavedRuleSets();
	setEventListeners();
}

// 初期状態を読み込む関数
async function loadCurrentState() {
	const { currentRules: savedRules = {} } = await chrome.storage.sync.get([
		"currentRules",
	]);
	currentRules = savedRules;

	// input要素に現在のルールを反映
	applyCurrentRulesToInputs();
}

// 現在のルールを入力要素に反映させる関数
function applyCurrentRulesToInputs() {
	const inputs = rulesContainer.querySelectorAll("input");
	for (const input of inputs) {
		const id = input.id;
		const value = currentRules[id];

		// currentRulesに値がある場合は反映し、ない場合はリセット
		if (value !== undefined) {
			// 配列の場合はカンマ区切りで表示
			input.value = Array.isArray(value) ? value.join(", ") : value;
		} else {
			input.value = ""; // 値がない場合はリセット
		}
	}
}

// イベントリスナーの設定を行う関数
function setEventListeners() {
	// input要素に変更イベントを設定し、currentRulesを更新する
	const inputs = rulesContainer.querySelectorAll("input");
	for (const input of inputs) {
		input.addEventListener("input", handleInputChange);
	}

	// savedRuleSetsの値が変更された場合に、選択されたルールセットを読み込む
	savedRuleSetsSelect.addEventListener("change", loadSelectedRuleSet);

	document
		.querySelector("#saveRules")
		?.addEventListener("click", saveCurrentRules);
	document
		.querySelector("#deleteRules")
		?.addEventListener("click", deleteSelectedRuleSet);
	document
		.querySelector("#exportRules")
		?.addEventListener("click", exportRules);
	document
		.querySelector("#importRules")
		?.addEventListener("click", importRules);
	document
		.querySelector("#startCheck")
		?.addEventListener("click", sendRulesToActiveTab);
}

// 入力値が変更された時にcurrentRulesを更新する関数
function handleInputChange(event: Event) {
	const input = event.target as HTMLInputElement;
	const id = input.id;
	// 入力値が空の場合はcurrentRulesから削除
	if (input.value === "") {
		delete currentRules[id];
		updateRules();
		return;
	}
	const value = input.value.split(",").map((val) => val.trim());

	// currentRulesを更新
	currentRules[id] = value;

	// rulesの更新を反映
	updateRules();
}

// ルールを更新する関数
async function updateRules() {
	await chrome.storage.sync.set({
		currentRules,
	});
}

// アクティブなタブにルールを送信する関数
async function sendRulesToActiveTab() {
	console.log("Sending rules to active tab:", currentRules);
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	console.log("Active tab:", tab);
	if (tab.id) {
		chrome.tabs.sendMessage(
			tab.id,
			{
				type: "CHECK_DESIGN",
				rules: currentRules,
			},
			() => {
				console.log("Message sent!");
			},
		);
	}
}

// ルールを保存する関数
async function saveCurrentRules() {
	const name = prompt("Enter a name for this rule set:");
	if (name) {
		await saveRuleSet(name, currentRules);
		await loadSavedRuleSets();
	}
}

// 保存されたルールセットをロードする関数
async function loadSavedRuleSets() {
	const ruleSets = await getRuleSets();
	savedRuleSetsSelect.innerHTML = "";
	for (const { name } of ruleSets) {
		const option = document.createElement("option");
		option.value = name;
		option.textContent = name;
		savedRuleSetsSelect.appendChild(option);
	}
}

// ルールセットを読み込む関数
async function loadSelectedRuleSet() {
	const name = savedRuleSetsSelect.value;
	const ruleSets = await getRuleSets();
	const ruleSet = ruleSets.find((set) => set.name === name);

	if (ruleSet) {
		currentRules = ruleSet.rules as Record<string, string | string[]>;
		await updateRules();
		await loadCurrentState();
	}
}

// ルールセットを削除する関数
async function deleteSelectedRuleSet() {
	const name = savedRuleSetsSelect.value;
	if (name && confirm(`Delete rule set "${name}"?`)) {
		await deleteRuleSet(name);
		await loadSavedRuleSets();
	}
}

// ルールをエクスポートする関数
function exportRules() {
	const json = JSON.stringify(currentRules, null, 2);
	navigator.clipboard.writeText(json);
	alert("Rules copied to clipboard!");
}

// ルールをインポートする関数
async function importRules() {
	const json = prompt("Paste rules JSON:");
	if (json) {
		try {
			currentRules = JSON.parse(json);
			await updateRules();
			await loadCurrentState();
		} catch (error) {
			alert("Invalid JSON format!");
		}
	}
}
