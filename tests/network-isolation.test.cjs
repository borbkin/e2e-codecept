require('ts-node/register');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { chromium } = require('playwright');
const { isAdvertisingUrl, isolateAdvertising } = require('../src/helpers/NetworkIsolation');

test('blocks advertising hosts without matching application or lookalike hosts', () => {
  for (const host of ['pagead2.googlesyndication.com', 'googleads.g.doubleclick.net',
    'fundingchoicesmessages.google.com', 'ep1.adtrafficquality.google', 's0.2mdn.net']) {
    assert.equal(isAdvertisingUrl(new URL(`https://${host}/script.js`)), true);
  }
  for (const host of ['automationexercise.com', 'fonts.googleapis.com',
    'notdoubleclick.net', 'doubleclick.net.example.com']) {
    assert.equal(isAdvertisingUrl(new URL(`https://${host}/login`)), false);
  }
});

test('installs isolation before navigation and preserves application requests across pages', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const reached = [];
    await context.route('**/*', route => {
      reached.push(route.request().url());
      return route.fulfill({ contentType: 'text/html', body: '<button>Login</button>' });
    });
    await isolateAdvertising(context);
    for (let i = 0; i < 2; i++) {
      const page = await context.newPage();
      await page.goto('https://automationexercise.com/login');
      assert.equal(await page.locator('button').textContent(), 'Login');
      await assert.rejects(page.goto('https://fundingchoicesmessages.google.com/survey'), /ERR_BLOCKED_BY_CLIENT/);
      await page.close();
    }
    assert.deepEqual(reached, Array(2).fill('https://automationexercise.com/login'));
  } finally {
    await browser.close();
  }
});
