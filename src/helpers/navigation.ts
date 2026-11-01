import type { Page } from 'playwright';

// Retry only a rejected GET document, never a submitted login/registration action.
export async function openPageWithOverloadRetry(page: Page, url: string): Promise<void> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await page.goto(url, { waitUntil: 'commit' });
    const status = response?.status();
    if (status === 503 && attempt < 3) {
      console.warn(`GET ${url} returned 503; retry ${attempt}/2`);
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      continue;
    }
    if (!response || !response.ok()) {
      throw new Error(`GET ${url} failed: HTTP ${status ?? 'no response'} (attempt ${attempt}/3)`);
    }
    return;
  }
}
