import { LoginPage } from '../pages/LoginPage';

Feature('Login page');

let userName: string;
let email: string;
let password: string;

Before(async ({ I }) => {
  userName = 'Автотест';
  email = `test_${Date.now()}@example.com`;
  password = '123456';

  await I.registerNewUser(userName, email, password);
});

Scenario('Позитивный вход по email и паролю', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, email);
  await I.fillField(LoginPage.passwordField, password);
  await I.click(LoginPage.submitButton);

  await I.waitForText('Logged in as', 10);
  await I.see(LoginPage.loggedInText(userName));
});
