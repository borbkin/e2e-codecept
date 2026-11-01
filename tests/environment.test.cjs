require('ts-node/register');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createCodeceptConfig } = require('../src/config/codeceptConfig');
const { buildURL, loadEnvironment, normalizeBaseURL } = require('../src/config/environment');

test('local and CI profiles use their expected defaults', () => {
  assert.deepEqual(loadEnvironment({}), {
    profile: 'local',
    baseURL: 'https://automationexercise.com/',
    headless: false
  });
  assert.deepEqual(loadEnvironment({ CI: 'true' }), {
    profile: 'ci',
    baseURL: 'https://automationexercise.com/',
    headless: true
  });
  assert.equal(loadEnvironment({ TEST_PROFILE: 'ci', HEADLESS: 'false' }).headless, false);
  assert.equal(loadEnvironment({ TEST_PROFILE: 'local', HEADLESS: 'true' }).headless, true);
});

test('BASE_URL is validated, normalized, and joined with a configured base path', () => {
  assert.equal(normalizeBaseURL('https://example.test/shop///'), 'https://example.test/shop/');
  const env = { BASE_URL: 'http://127.0.0.1:4000/shop' };
  assert.equal(buildURL('/login', env), 'http://127.0.0.1:4000/shop/login');
  assert.equal(buildURL('/', env), 'http://127.0.0.1:4000/shop/');
  assert.throws(() => loadEnvironment({ BASE_URL: 'not a url' }), /Invalid BASE_URL/);
  assert.throws(() => loadEnvironment({ BASE_URL: 'ftp://example.test' }), /Invalid BASE_URL/);
  assert.throws(() => loadEnvironment({ BASE_URL: 'https://example.test/path?query=1' }), /Query strings/);
  assert.throws(() => buildURL('https://other.test', env), /relative to BASE_URL/);
});

test('invalid profile and HEADLESS values fail clearly', () => {
  assert.throws(() => loadEnvironment({ TEST_PROFILE: 'desktop' }), /Invalid TEST_PROFILE/);
  assert.throws(() => loadEnvironment({ HEADLESS: 'yes' }), /Invalid HEADLESS/);
});

test('mobile profile configures Pixel 7 touch emulation without desktop window sizing', () => {
  const environment = loadEnvironment({ TEST_PROFILE: 'mobile' });
  assert.equal(environment.mobileDeviceName, 'Pixel 7');
  assert.deepEqual(environment.mobileDevice?.viewport, { width: 412, height: 839 });
  assert.equal(environment.mobileDevice?.defaultBrowserType, 'chromium');
  assert.equal(environment.mobileDevice?.hasTouch, true);
  assert.equal(environment.mobileDevice?.isMobile, true);

  const playwright = createCodeceptConfig(environment).helpers?.Playwright;
  assert.equal(playwright?.browser, 'chromium');
  assert.deepEqual(playwright?.emulate, environment.mobileDevice);
  assert.equal(playwright?.windowSize, undefined);
  assert.equal(playwright?.show, false);
});

test('mobile device overrides must name Chromium mobile devices and explicit headed mode is kept', () => {
  assert.equal(loadEnvironment({ TEST_PROFILE: 'mobile', MOBILE_DEVICE: 'Pixel 5' }).mobileDeviceName, 'Pixel 5');
  assert.throws(
    () => loadEnvironment({ TEST_PROFILE: 'mobile', MOBILE_DEVICE: 'Missing Phone' }),
    /Unsupported MOBILE_DEVICE "Missing Phone"/
  );
  assert.throws(
    () => loadEnvironment({ TEST_PROFILE: 'mobile', MOBILE_DEVICE: 'iPhone 13' }),
    /known Playwright Chromium mobile device/
  );

  const headed = createCodeceptConfig(loadEnvironment({ HEADLESS: 'false' }, 'mobile')).helpers?.Playwright;
  assert.equal(headed?.show, true);
  assert.ok(headed?.emulate);
  assert.equal(headed?.windowSize, undefined);
});
