import { Settings } from '../types/settings';
import { log } from './log';

export const getSettings = async (): Promise<Settings> => {
  const settings = (await browser.storage.sync.get()) as Settings;

  if (!settings) {
    log(`no settings found, returning default settings`);
    return {
      accounts: [],
    };
  }

  log(JSON.stringify(settings, null, '  '));

  return settings;
};

export const setSettings = async (settings: Settings): Promise<void> => {
  log('storing new settings:');
  log(JSON.stringify(settings, null, '  '));

  const newSettings = { ...settings };

  for (const account of newSettings.accounts) {
    for (const profile of account.profiles) {
      profile.link = null;
    }
  }

  await browser.storage.sync.set(newSettings);
};

export const patchSettings = async (partialSettings: Partial<Settings>): Promise<void> => {
  const settings = await getSettings();
  const patchedSettings: Settings = Object.assign(settings, partialSettings);
  await setSettings(patchedSettings);
};
