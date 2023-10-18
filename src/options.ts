/// <reference types="web-ext-types"/>

import { getSettings } from './lib/storage-utils';

const saveOptions = async (e: Event) => {
  e.preventDefault();
  await browser.storage.sync.set({
    accounts: '{}',
  });
};

const restoreOptions = async () => {
  let settings = await getSettings();
  set('accounts', settings.accounts, []);
};

const set = <T>(key: string, value: T, defaultValue: T): void => {
  const elm = document.querySelector(`#${key}`) as HTMLInputElement;
  elm.value = JSON.stringify(value) ?? JSON.stringify(defaultValue);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
