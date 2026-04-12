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

After(async ({ I }) => {
  // Удаляем тестового пользователя, если он был создан
  await I.logout();
  await I.deleteTestUser(userData.email, userData.password);
});
