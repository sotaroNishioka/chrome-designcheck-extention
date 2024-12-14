import type { DesignRule, SavedRuleSet } from "../types/rules";

export const saveRuleSet = async (
	name: string,
	rules: DesignRule,
): Promise<void> => {
	const { ruleSets = [] } = await chrome.storage.sync.get("ruleSets");
	const newRuleSets = [...ruleSets, { name, rules }];
	await chrome.storage.sync.set({ ruleSets: newRuleSets });
};

export const getRuleSets = async (): Promise<SavedRuleSet[]> => {
	const { ruleSets = [] } = await chrome.storage.sync.get("ruleSets");
	return ruleSets;
};

export const deleteRuleSet = async (name: string): Promise<void> => {
	const { ruleSets = [] } = await chrome.storage.sync.get("ruleSets");
	const newRuleSets = ruleSets.filter((set: SavedRuleSet) => set.name !== name);
	await chrome.storage.sync.set({ ruleSets: newRuleSets });
};
