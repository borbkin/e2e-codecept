import { LoginPage } from '../pages/LoginPage';

Feature('Login page');

Scenario('Открытие страницы логина', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.see(LoginPage.loginTitle);
});

Scenario('Негативный вход по email и паролю', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, 'wrong@example.com');
  await I.fillField(LoginPage.passwordField, 'wrongpassword');
  await I.click(LoginPage.submitButton);

  await I.waitForText('Your email or password is incorrect!', 5, '.login-form');
  await I.dontSee('Logged in as');
});
