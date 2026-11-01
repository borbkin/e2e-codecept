require('ts-node/register');
const assert = require('node:assert/strict');
const { readdirSync } = require('node:fs');
const path = require('node:path');
const Mocha = require('mocha');
const container = require('codeceptjs/lib/container');

// Load real scenarios through CodeceptJS without executing hooks or browser/API
// actions. Multiple Feature() declarations in one file can lose teardown hooks.
container.create({ helpers: {}, plugins: {}, include: {} }, {});
const mocha = new Mocha({ ui: require.resolve('codeceptjs/lib/mocha/ui') });
const testDir = path.resolve(__dirname, '../src/tests');
for (const file of readdirSync(testDir).filter(file => file.endsWith('_test.ts'))) {
  mocha.addFile(path.join(testDir, file));
}
mocha.loadFiles();

const suites = mocha.suite.suites.filter(suite => suite.tests.length > 0);
assert.ok(suites.length > 0, 'Real scenarios must be discovered');
for (const suite of suites) {
  assert.ok(suite._afterEach.some(hook => hook.title.endsWith('finalize codeceptjs')),
    `${suite.file}: ${suite.title} is missing CodeceptJS per-test teardown`);
  assert.ok(suite._afterAll.some(hook => hook.title.endsWith('codeceptjs.afterSuite')),
    `${suite.file}: ${suite.title} is missing CodeceptJS suite teardown`);
}
console.log(`Verified CodeceptJS teardown hooks for ${suites.length} real feature suites`);
