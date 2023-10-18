import { TabMessageType, TabMessageResult } from '../types/message';
import { log } from './log';

export const sendMessage = async <TResponse>(tabId: number, type: TabMessageType, message: any = null) => {
  log(`Sending message '${type}' to tab ${tabId}`);
  const response = await browser.tabs.sendMessage(tabId, { type: type, message: message });
  const responseMessage = response as TabMessageResult<TResponse>;
  return responseMessage?.result;
};

export const getIdentityContext = async (tabId: number) => {
  try {
    const tab = await browser.tabs.get(tabId);

    if (!tab) {
      log(`cannot get identityContext, tab with id ${tabId} not found`);
      return null;
    }

    const cookieStoreId = tab.cookieStoreId;
    if (!cookieStoreId || cookieStoreId === 'firefox-default') {
      log(`cannot get identityContext, tab with id ${tabId} has cookieStoreId ${tab.cookieStoreId}`);
      return null;
    }

    const contextualIdentity = await browser.contextualIdentities.get(cookieStoreId);

    if (!contextualIdentity || !contextualIdentity.name) {
      log(
        `cannot get identityContext, tab with id ${tabId} has cookieStoreId ${tab.cookieStoreId} but contextualIdentity not found`
      );
      return null;
    }
    return contextualIdentity;
  } catch (err) {
    log(`cannot get identityContext for tab with id ${tabId}: ${err}`);
    return null;
  }
};
