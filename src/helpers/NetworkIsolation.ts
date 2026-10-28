import { Helper } from 'codeceptjs';
import type { BrowserContext } from 'playwright';

// Only advertising/survey hosts observed in CI HARs; application traffic stays real.
const advertisingHosts = [
  'googlesyndication.com',
  'doubleclick.net',
  'fundingchoicesmessages.google.com',
  'adtrafficquality.google',
  '2mdn.net'
];

export function isAdvertisingUrl(url: URL): boolean {
  return advertisingHosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

export async function isolateAdvertising(context: BrowserContext): Promise<void> {
  await context.route(isAdvertisingUrl, route => route.abort('blockedbyclient'));
}

export default class NetworkIsolation extends Helper {
  async _before(): Promise<void> {
    await isolateAdvertising(this.helpers.Playwright.browserContext);
  }
}
