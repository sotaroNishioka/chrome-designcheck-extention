import { deleteRuleSet, getRuleSets, saveRuleSet } from "../utils/storage";

// 現在のルールを保持する変数
let currentRules: Record<string, string | string[]> = {};

// DOM要素をキャッシュする変数
const enableCheckingInput = document.querySelector('#enableChecking') as HTMLInputElement;
const rulesContainer = document.querySelector('.rules-container') as HTMLDivElement;
const savedRuleSetsSelect = document.querySelector('#savedRuleSets') as HTMLSelectElement;

export function initializePopup() {
  loadCurrentState();
  setEventListeners();
}

// 初期状態を読み込む関数
async function loadCurrentState() {
  const { currentRules: savedRules = {}, isEnabled = false } = await chrome.storage.sync.get([
    'currentRules',
    'isEnabled'
  ]);
  console.log('Loading current state:', savedRules, isEnabled);
  currentRules = savedRules;
  enableCheckingInput.checked = isEnabled;

  // input要素に現在のルールを反映
  applyCurrentRulesToInputs();
}

// 現在のルールを入力要素に反映させる関数
function applyCurrentRulesToInputs() {
  const inputs = rulesContainer.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id;
    const value = currentRules[id];
    if (value !== undefined) {
      input.value = Array.isArray(value) ? value.join(', ') : value;
    }
  });
}

// イベントリスナーの設定を行う関数
function setEventListeners() {
  enableCheckingInput.addEventListener('change', updateRules);

  // input要素に変更イベントを設定し、currentRulesを更新する
  const inputs = rulesContainer.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', handleInputChange);
  });

  document.querySelector('#saveRules')?.addEventListener('click', saveCurrentRules);
  document.querySelector('#loadRules')?.addEventListener('click', loadSelectedRuleSet);
  document.querySelector('#deleteRules')?.addEventListener('click', deleteSelectedRuleSet);
  document.querySelector('#exportRules')?.addEventListener('click', exportRules);
  document.querySelector('#importRules')?.addEventListener('click', importRules);
}

// 入力値が変更された時にcurrentRulesを更新する関数
function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const id = input.id;
  const value = input.value.split(',').map(val => val.trim());

  // currentRulesを更新
  currentRules[id] = value.length === 1 ? value[0] : value;

  // rulesの更新を反映
  updateRules();
}

// ルールを更新する関数
async function updateRules() {
  console.log('Updating rules:', currentRules);
  await chrome.storage.sync.set({
    currentRules,
    isEnabled: enableCheckingInput.checked
  });

  sendRulesToActiveTab(currentRules);
}

// アクティブなタブにルールを送信する関数
async function sendRulesToActiveTab(newRules: Record<string, string | string[]>) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'UPDATE_RULES',
      rules: newRules,
      enabled: enableCheckingInput.checked
    });
  }
}

// ルールを保存する関数
async function saveCurrentRules() {
  const name = prompt('Enter a name for this rule set:');
  if (name) {
    await saveRuleSet(name, currentRules);
    await loadSavedRuleSets();
  }
}

// 保存されたルールセットをロードする関数
async function loadSavedRuleSets() {
  const ruleSets = await getRuleSets();
  savedRuleSetsSelect.innerHTML = '';
  ruleSets.forEach(({ name }) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    savedRuleSetsSelect.appendChild(option);
  });
}

// ルールセットを読み込む関数
async function loadSelectedRuleSet() {
  const name = savedRuleSetsSelect.value;
  const ruleSets = await getRuleSets();
  const ruleSet = ruleSets.find(set => set.name === name);

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
  alert('Rules copied to clipboard!');
}

// ルールをインポートする関数
async function importRules() {
  const json = prompt('Paste rules JSON:');
  if (json) {
    try {
      currentRules = JSON.parse(json);
      await updateRules();
      await loadCurrentState();
    } catch (error) {
      alert('Invalid JSON format!');
    }
  }
}
