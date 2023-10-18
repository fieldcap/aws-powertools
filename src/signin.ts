const bodyText = document.body.innerText;

if (bodyText.indexOf('Your session has expired.') > -1) {
  document.location.href = 'https://fieldcap.awsapps.com/start#/';
}
