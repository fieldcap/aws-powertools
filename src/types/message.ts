export type BackgroundMessage = {
  type: BackgroundMessageType;
  message: any;
};

export type TabMessage = {
  type: TabMessageType;
};

export type BackgroundMessageType = 'getContext' | 'setAccounts' | 'setStartUrl' | 'getSettings';

export type BackgroundMessageResult<T> = {
  tabId: number;
  type: BackgroundMessageType;
  result: T;
};

export type TabMessageType = 'navigateToLandingPage';

export type TabMessageResult<T> = {
  tabId: number;
  type: BackgroundMessageType;
  result: T;
};
