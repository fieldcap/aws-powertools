import { BackgroundMessageType, BackgroundMessageResult } from '../types/message';
import { log } from './log';

export const sendMessage = async <TResponse>(type: BackgroundMessageType, message: any = null) => {
  log(`Sending message '${type}'`);
  const response = await browser.runtime.sendMessage({ type: type, message: message });
  const result = response as BackgroundMessageResult<TResponse>;
  return result?.result;
};

export const waitForElement = async (
  tagName: string,
  timeout: number = 1000,
  parentElement: Element | null = document.body
): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    log(`Waiting for '${tagName}' for ${timeout}ms`);

    const start = performance.now();

    const intervalId = setInterval(() => {
      if (parentElement) {
        const existingElement = parentElement.querySelector(tagName);
        if (existingElement) {
          clearInterval(intervalId);
          clearTimeout(failureTimeout);

          const elapsed = performance.now() - start;
          log(`Found '${tagName}' on parent after ${elapsed}ms`);

          resolve(existingElement as HTMLElement);
        }
      } else {
        parentElement = document.body;
      }
    }, 100);

    const failureTimeout = setTimeout(() => {
      clearInterval(intervalId);
      clearTimeout(failureTimeout);
      const elapsed = performance.now() - start;
      log(`Failed to find '${tagName}' on parent after ${elapsed}ms`);
      reject(new Error(`Failed to find the element with tag name ${tagName} within ${timeout}ms`));
    }, timeout);
  });
};
