require('ts-node/register');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createServer } = require('node:http');
const { once } = require('node:events');
const { chromium } = require('playwright');
const { faker } = require('@faker-js/faker');
const { buildTestUser } = require('../src/utils/testUser');
const { openPageWithOverloadRetry } = require('../src/helpers/navigation');

test('test emails stay unique across processes with the same Faker seed', () => {
  faker.seed(42);
  const first = buildTestUser();
  faker.seed(42);
  const second = buildTestUser();
  assert.equal(first.name, second.name);
  assert.notEqual(first.email, second.email);
  assert.match(first.email, /^e2e-[a-f0-9-]+@example\.com$/);
  assert.equal(buildTestUser({ email: 'explicit@example.com' }).email, 'explicit@example.com');
});

test('GET retries transient 503, fails persistent overload, and does not retry other responses', async () => {
  let requests = 0;
  let status = 503;
  let recover = false;
  const server = createServer((request, response) => {
    if (request.url !== '/login') {
      response.writeHead(404).end();
      return;
    }
    requests++;
    const current = recover && requests > 1 ? 200 : status;
    response.writeHead(current, { 'Content-Type': 'text/html' });
    response.end(current === 200 ? '<input data-qa="login-email">' : 'queue full');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const url = `http://127.0.0.1:${server.address().port}/login`;
    recover = true;
    await openPageWithOverloadRetry(page, url);
    await page.locator('[data-qa="login-email"]').waitFor();
    assert.equal(requests, 2);

    recover = false;
    requests = 0;
    await assert.rejects(openPageWithOverloadRetry(page, url), /HTTP 503 \(attempt 3\/3\)/);
    assert.equal(requests, 3);

    status = 500;
    requests = 0;
    await assert.rejects(openPageWithOverloadRetry(page, url), /HTTP 500 \(attempt 1\/3\)/);
    assert.equal(requests, 1);

    status = 200;
    requests = 0;
    await openPageWithOverloadRetry(page, url);
    assert.equal(requests, 1);
  } finally {
    await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
