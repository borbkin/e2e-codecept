const { test } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
let apiClient;

function api() {
  if (!apiClient) {
    require('ts-node/register');
    apiClient = require('../src/api/apiClient');
  }
  return apiClient;
}

const user = {
  name: 'Ada & Bob',
  email: 'ada+bob@example.com',
  password: 'p@ss word&more',
  title: 'Mrs',
  birthDay: '3',
  birthMonth: 'April',
  birthYear: '1994',
  firstName: 'Ada',
  lastName: 'Lovelace',
  address: '12 Main St & 2nd Ave',
  country: 'United States',
  state: 'New York',
  city: 'New York',
  zipcode: '10001',
  mobileNumber: '+1 555-123-4567'
};

function clientFor(responseOrError, requests = []) {
  return axios.create({
    adapter: async (config) => {
      requests.push(config);
      if (responseOrError instanceof Error) throw responseOrError;
      return {
        data: responseOrError,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }
  });
}

test('create posts correctly encoded account fields with a bounded timeout', async () => {
  const requests = [];
  await api().createUserViaAPI(user, { client: clientFor({ responseCode: 201 }, requests), baseURL: 'http://offline.test/api' });

  const request = requests[0];
  assert.equal(request.method, 'post');
  assert.equal(request.url, 'http://offline.test/api/createAccount');
  assert.equal(request.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.ok(request.timeout > 0 && request.timeout <= 30_000);
  assert.deepEqual(Object.fromEntries(new URLSearchParams(request.data)), {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    address1: user.address,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobile_number: user.mobileNumber
  });
  assert.match(request.data, /ada%2Bbob%40example\.com/);
  assert.match(request.data, /p%40ss\+word%26more/);
});

test('delete sends encoded credentials and accepts cleanup response codes 200 and 404', async () => {
  for (const responseCode of [200, 404]) {
    const requests = [];
    await api().deleteUserViaAPI({ email: user.email, password: user.password }, {
      client: clientFor({ responseCode }, requests),
      baseURL: 'http://offline.test/api'
    });
    const request = requests[0];
    assert.equal(request.method, 'delete');
    assert.equal(request.url, 'http://offline.test/api/deleteAccount');
    assert.equal(request.headers['Content-Type'], 'application/x-www-form-urlencoded');
    assert.ok(request.timeout > 0 && request.timeout <= 30_000);
    assert.deepEqual(Object.fromEntries(new URLSearchParams(request.data)), {
      email: user.email,
      password: user.password
    });
  }
});

test('business error codes and missing or malformed payloads reject', async (t) => {
  const createErrors = [
    { responseCode: 400, message: 'Email already exists' },
    {},
    null
  ];
  for (const payload of createErrors) {
    await t.test(`create rejects ${JSON.stringify(payload)}`, async () => {
      await assert.rejects(api().createUserViaAPI(user, { client: clientFor(payload) }), /createUserViaAPI failed/);
    });
  }

  for (const payload of [
    { responseCode: 403, message: 'Invalid credentials' },
    {},
    null
  ]) {
    await t.test(`delete rejects ${JSON.stringify(payload)}`, async () => {
      await assert.rejects(
        api().deleteUserViaAPI({ email: user.email, password: user.password }, { client: clientFor(payload) }),
        /deleteUserViaAPI failed/
      );
    });
  }
});

test('HTTP failures and timeouts propagate from Axios', async (t) => {
  await t.test('HTTP 403', async () => {
    const error = new axios.AxiosError('Request failed with status code 403', 'ERR_BAD_REQUEST', {}, {}, {
      data: { message: 'Forbidden' }, status: 403, statusText: 'Forbidden', headers: {}, config: {}
    });
    await assert.rejects(api().createUserViaAPI(user, { client: clientFor(error) }), (caught) => caught === error);
  });

  await t.test('timeout', async () => {
    const error = new axios.AxiosError('timeout of 30000ms exceeded', 'ECONNABORTED');
    await assert.rejects(
      api().deleteUserViaAPI({ email: user.email, password: user.password }, { client: clientFor(error) }),
      (caught) => caught === error
    );
  });
});
