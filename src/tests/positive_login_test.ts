import { deleteUserViaAPI } from '../api/apiClient';
import { loginThroughUi, openAuthPage } from '../helpers/authFlow';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Login page');

let userData: TestUser;

Before(async ({ I }) => {
  userData = buildTestUser();
  await I.registerNewUser(userData);
});

Scenario('Позитивный вход по email и паролю @smoke @regression @auth', async ({ I }) => {
  await openAuthPage(I);
  await loginThroughUi(I, userData);
});

// Browser contexts are discarded by CodeceptJS; cleanup must not depend on logout.
After(async () => {
  await deleteUserViaAPI(userData);
});
