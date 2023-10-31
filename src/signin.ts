import { getSettings } from './lib/storage-utils';

const bodyText = document.body.innerText;

if (
  bodyText.indexOf('Your session has expired.') > -1 ||
  bodyText.indexOf('There was a problem with your session. ') > -1
) {
  const urls = bodyText.match(/https.*? /);
  const url = urls[0];

  if (url) {
    document.location.href = url.trim();
  } else {
    const settings = await getSettings();

    if (settings.startUrl) {
      document.location.href = settings.startUrl;
    }
  }
}
if (bodyText.indexOf('Account owner that performs tasks requiring unrestricted access.') > -1) {
  const settings = await getSettings();

  if (settings.startUrl) {
    document.location.href = settings.startUrl;
  }
}
