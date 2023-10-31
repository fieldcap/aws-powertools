/// <reference types="web-ext-types"/>

import { sendMessage, waitForElement } from './lib/context-utils';
import { log } from './lib/log';
import { Account, AccountProfile } from './types/account';

log(`Starting content script`);

const identityContext = await sendMessage<browser.contextualIdentities.ContextualIdentity>('getContext');

const reload = async () => {
  log(`Reloading`);
  if (location.hash !== '#/') {
    log(`Skipped reloading, page not on main hash`);
    return;
  }

  try {
    await waitForElement('portal-application-list', 5000);
  } catch {
    return;
  }

  await sendMessage('setStartUrl', window.location.href);

  const ssoExpander = document.querySelectorAll('sso-expander');

  if (ssoExpander.length === 0) {
    log(`expanding all accounts`);
    const portalAccounts = document.querySelectorAll('portal-application');
    portalAccounts.forEach((portalAccount: HTMLElement) => {
      portalAccount.click();
    });
  } else {
    log(`skipped expanding accounts, found ${ssoExpander.length} sso-expander elements`);
  }

  const portalInstances = document.querySelectorAll('portal-instance');

  const accounts: Account[] = [];

  log(`iterating ${portalInstances.length} portal-instance elements`);

  for (const portalInstance of portalInstances) {
    const nameElement = portalInstance.querySelector('.name');
    const accountIdElement = portalInstance.querySelector('.accountId');
    const emailElement = portalInstance.querySelector('.email');

    if (nameElement && accountIdElement && emailElement) {
      const account: Account = {
        name: nameElement.textContent.trim(),
        accountId: accountIdElement.textContent.replace(/#/, '').trim(),
        email: emailElement.textContent.trim(),
        profiles: [],
      };

      log(`found account ${account.name} ${account.accountId} ${account.email}`);

      const existingPortalProfiles = portalInstance.querySelectorAll('portal-profile');

      if (existingPortalProfiles.length == 0) {
        log(`expanding all account profiles`);
        const clickElement = portalInstance.getElementsByClassName('instance-section')[0] as HTMLDivElement;
        clickElement.click();
      } else {
        log(`skipped expanding profiles, found ${ssoExpander.length} instance-section elements`);
      }

      try {
        await waitForElement('portal-profile', 5000, portalInstance);

        const portalProfiles = portalInstance.querySelectorAll('portal-profile');

        log(`iterating ${portalProfiles.length} portal-profile elements`);

        portalProfiles.forEach((portalProfile: HTMLElement) => {
          const nameElement = portalProfile.querySelector('.profile-name');
          const linkElement = portalProfile.querySelector('.profile-link') as HTMLLinkElement;

          if (nameElement && linkElement) {
            const profile: AccountProfile = {
              name: nameElement.textContent.trim(),
              link: linkElement.href.trim(),
            };
            log(`found profile ${profile.name}`);
            account.profiles.push(profile);
          }
        });
      } catch {
        return;
      }

      accounts.push(account);
    }
  }

  log(`found ${accounts.length} accounts`);

  await sendMessage('setAccounts', accounts);

  if (identityContext != null) {
    log(`trying to find account for identity '${identityContext}'`);

    const identityAccount = identityContext.name.split(':')[0];
    const identityRole = identityContext.name.split(':')[1];

    let account = accounts.find((m) => m.accountId === identityAccount);

    if (account == null) {
      account = accounts.find((m) => m.name === identityAccount);
    }

    if (account != null) {
      log(`found account ${account.name} (${account.accountId})`);

      let profile = account.profiles[0];
      if (identityRole) {
        log(`trying to find profile for role ${identityRole}`);
        profile = account.profiles.find((m) => m.name === identityRole);
      } else {
        log(`no profile set in identity, selecting first profile`);
      }

      if (profile) {
        log(`found profile ${profile.name}`);
        window.location.href = profile.link;
      }
    }
  } else {
    log(`no identity context found, not redirecting to login`);
  }
};

window.addEventListener('hashchange', function () {
  reload();
});

reload();
