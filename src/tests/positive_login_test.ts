import { LoginPage } from '../pages/LoginPage';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Login page');

let userData: TestUser;

Before(async ({ I }) => {
  userData = buildTestUser();
  await I.registerNewUser(userData);
});

Scenario('Позитивный вход по email и паролю @smoke @regression @auth', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, userData.email);
  await I.fillField(LoginPage.passwordField, userData.password);
  await I.click(LoginPage.submitButton);

  await I.waitForText('Logged in as', 10);
  await I.see(LoginPage.loggedInText(userData.name));
});

After(async ({ I }) => {
  // Удаляем тестового пользователя, если он был создан
  await I.logout();
  await I.deleteTestUser(userData.email, userData.password);
});
