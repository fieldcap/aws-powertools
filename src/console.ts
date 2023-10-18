/// <reference types="web-ext-types"/>

import { sendMessage, waitForElement } from './lib/context-utils';
import { log } from './lib/log';
import { Account } from './types/account';
import { Settings } from './types/settings';

log(`Starting content script`);

const identityContext = await sendMessage<browser.contextualIdentities.ContextualIdentity>('getContext');
const settings = await sendMessage<Settings>('getSettings');

log(`retrieving account ID`);
await waitForElement('[data-testid=account-detail-menu]', 10000);

let account: Account = null;

const reload = async () => {
  const accountDetailMenuElement = await waitForElement('[data-testid=account-detail-menu]', 10000);
  const accountDetailMenuSubElements = accountDetailMenuElement.querySelectorAll('span');

  let accountId: string = null;

  for (const accountDetailMenuSubElement of accountDetailMenuSubElements) {
    const textContent = accountDetailMenuSubElement.textContent.replace(/-/g, '');

    if (!textContent) {
      continue;
    }

    log(`testing ${textContent}`);
    if (/^\d+$/.test(textContent)) {
      accountId = textContent;
      break;
    }
  }

  log(`found account ID: ${accountId}`);

  account = settings.accounts.find((m) => m.accountId === accountId);

  if (account) {
    log(`found stored account: ${account.name} (${account.accountId})`);

    const nav = await waitForElement('nav');
    if (nav) {
      nav.style.backgroundColor = identityContext.color;
    }

    const footer = await waitForElement('#console-nav-footer-inner');
    if (footer) {
      footer.style.backgroundColor = identityContext.color;
    }

    const searchContainer = await waitForElement('#aws-unified-search-container', 10000);

    if (searchContainer) {
      const titleContainer = document.getElementById('aws-powertools-account-name');
      if (titleContainer) {
        titleContainer.innerText = `${account.name} (${account.accountId})`;
      } else {
        const searchContainerChild = searchContainer.childNodes[0] as HTMLDivElement;
        const searchContainerTitle = document.createElement('div');
        searchContainerTitle.id = 'aws-powertools-account-name';
        searchContainerTitle.innerText = `${account.name} (${account.accountId})`;
        searchContainerChild.appendChild(searchContainerTitle);
      }
    }

    setTitle();
  } else {
    log(`no matching account found`);
  }
};

const setTitle = () => {
  if (!account) {
    return;
  }

  document.title = document.title.replace(`${account.name}: `, '');
  document.title = `${account.name}: ${document.title}`;
};

new MutationObserver((mutations) => {
  setTitle();
}).observe(document.querySelector('title'), { subtree: true, characterData: true, childList: false });

reload();
