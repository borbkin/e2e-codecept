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
  await I.login(email, password);
  await I.see(LoginPage.loggedInText(userName));
});
