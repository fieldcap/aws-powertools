export const getIdentityContext = async (tabId: number) => {
  try {
    const tab = await browser.tabs.get(tabId);

    if (!tab) {
      return null;
    }

    const cookieStoreId = tab.cookieStoreId;
    if (!cookieStoreId || cookieStoreId === 'firefox-default') {
      return null;
    }

    const contextualIdentity = await browser.contextualIdentities.get(cookieStoreId);

    if (!contextualIdentity || !contextualIdentity.name) {
      return null;
    }
    return contextualIdentity.name.trim();
  } catch (err) {
    console.error(err);
    return null;
  }
};
