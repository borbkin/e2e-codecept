const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, writeFile, readFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const execFile = promisify(require('node:child_process').execFile);
const root = path.resolve(__dirname, '..');

// Execute the real feature through CodeceptJS, with failed browser steps and a
// local Axios adapter. This exercises After/recorder behavior without the site.
for (const cleanupFails of [false, true]) {
  test(`UI failure survives teardown (cleanup fails: ${cleanupFails})`, async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'e2e-cleanup-'));
    const marker = path.join(dir, 'cleanup.json');
    try {
      await writeFile(path.join(dir, 'actor.cjs'), `
module.exports = () => actor({
  usePlaywrightTo() { throw new Error('primary-ui-failure'); },
  logout() { throw new Error('logout-must-not-run'); }
});
`);
      await writeFile(path.join(dir, 'config.cjs'), `
require(${JSON.stringify(require.resolve('ts-node/register'))});
const axios = require(${JSON.stringify(require.resolve('axios'))});
axios.defaults.adapter = async config => {
  require('node:fs').writeFileSync(${JSON.stringify(marker)}, JSON.stringify({ method: config.method, data: config.data }));
  return { data: { responseCode: ${cleanupFails ? 500 : 200}, message: 'cleanup-result' }, status: 200, statusText: 'OK', headers: {}, config };
};
exports.config = {
  tests: ${JSON.stringify(path.join(root, 'src/tests/register_test.ts'))},
  output: ${JSON.stringify(path.join(dir, 'output'))},
  helpers: {},
  include: { I: ${JSON.stringify(path.join(dir, 'actor.cjs'))} },
  plugins: { screenshotOnFail: { enabled: false } },
  name: 'cleanup-contract'
};
`);
      let failure;
      try {
        await execFile(process.execPath, [path.join(root, 'node_modules/codeceptjs/bin/codecept.js'),
          'run', '--config', path.join(dir, 'config.cjs')], {
          cwd: root, timeout: 30000, env: { ...process.env, TS_NODE_PROJECT: path.join(root, 'tsconfig.json') }
        });
      } catch (error) {
        failure = error;
      }
      assert.ok(failure, 'The intentional UI failure must fail the run');
      const output = `${failure.stdout}\n${failure.stderr}`;
      assert.match(output, /primary-ui-failure/);
      assert.doesNotMatch(output, /logout-must-not-run/);
      const request = JSON.parse(await readFile(marker, 'utf8'));
      assert.equal(request.method, 'delete');
      assert.match(new URLSearchParams(request.data).get('email'), /^e2e-.+@example\.com$/);
      if (cleanupFails) assert.match(output, /deleteUserViaAPI failed.*cleanup-result/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
}
