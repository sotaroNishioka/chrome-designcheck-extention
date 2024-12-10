import { Message } from './types/messages';

// Listen for tab updates to re-apply rules when pages load
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get(['currentRules', 'isEnabled'], (data) => {
      if (data.currentRules && data.isEnabled) {
        const message: Message = {
          type: 'UPDATE_RULES',
          rules: data.currentRules,
          enabled: data.isEnabled
        };
        
        chrome.tabs.sendMessage(tabId, message);
      }
    });
  }
});

// Listen for installation to set up initial storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    currentRules: {},
    isEnabled: false,
    ruleSets: []
  });
});