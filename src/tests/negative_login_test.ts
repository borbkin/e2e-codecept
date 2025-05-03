import { LoginPage } from '../pages/LoginPage';

Feature('Login page');

Scenario('Открытие страницы логина', async ({ I }) => {
  I.amOnPage(LoginPage.url);
  I.see('Login to your account');
});

Scenario('Негативный вход по email и паролю', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, 'wrong@example.com');
  await I.fillField(LoginPage.passwordField, 'wrongpassword');
  await I.click(LoginPage.submitButton);

  await I.waitForElement(LoginPage.errorMessage, 5);
  await I.see('Your email or password is incorrect!', LoginPage.errorMessage);
  await I.dontSee('Logged in as');
});