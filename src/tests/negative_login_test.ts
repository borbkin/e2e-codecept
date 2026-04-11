import { LoginPage } from '../pages/LoginPage';
import { buildTestUser } from '../utils/testUser';

Feature('Login page');

Scenario('Открытие страницы логина', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.see(LoginPage.loginTitle);
});

Scenario('Негативный вход по email и паролю', async ({ I }) => {
  const invalidUserData = buildTestUser();

  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, invalidUserData.email);
  await I.fillField(LoginPage.passwordField, invalidUserData.password);
  await I.click(LoginPage.submitButton);

  await I.waitForText('Your email or password is incorrect!', 5, '.login-form');
  await I.dontSee(LoginPage.loggedInText(invalidUserData.name));
});
