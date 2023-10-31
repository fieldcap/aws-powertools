/// <reference types="web-ext-types"/>

import { getIdentityContext } from './lib/background-utils';
import { log } from './lib/log';
import { getSettings, patchSettings } from './lib/storage-utils';
import { BackgroundMessage } from './types/message';

log('Starting background task');

browser.runtime.onMessage.addListener(
  (message: BackgroundMessage, sender: browser.runtime.MessageSender, sendResponse: (response: Object) => boolean) => {
    log(`Received message '${message.type}' from tab ${sender.tab.id}`);
    (async () => {
      let result: any = null;
      switch (message.type) {
        case 'getContext':
          result = await getIdentityContext(sender.tab.id);
          break;
        case 'setAccounts': {
          await patchSettings({ accounts: message.message });
          break;
        }
        case 'setStartUrl': {
          await patchSettings({ startUrl: message.message });
          break;
        }
        case 'getSettings':
          result = await getSettings();
          break;
      }
      sendResponse({ tabId: sender.tab.id, result: result, type: message.type });
    })();
    return true as any;
  }
);

browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.url === 'about:blank' && !tab.openerTabId) {
    const identity = await getIdentityContext(tab.id);

    if (identity) {
      browser.tabs.update(null, { url: 'https://console.aws.amazon.com' });
    }
  }
});
