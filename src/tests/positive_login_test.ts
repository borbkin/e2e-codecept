import { LoginPage } from '../pages/LoginPage';
import { generateUserData } from '../utils/factories';

Feature('Login page');

const userData = generateUserData();

Before(async ({ I }) => {
  await I.registerNewUser(userData.name, userData.email, userData.password);
});

Scenario('Позитивный вход по email и паролю', async ({ I }) => {
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