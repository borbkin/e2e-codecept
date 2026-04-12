import { AuthForm } from '../fragments/AuthForm';
import { Header } from '../fragments/Header';
import { openAuthPage } from '../helpers/authFlow';
import { buildTestUser } from '../utils/testUser';

Feature('Login page');

Scenario('Открытие страницы логина @regression @auth', async ({ I }) => {
  await I.amOnPage('/login');
  await I.see(AuthForm.loginTitle);
});

Scenario('Негативный вход по email и паролю @regression @auth', async ({ I }) => {
  const invalidUserData = buildTestUser();

  await openAuthPage(I);

  await I.fillField(AuthForm.loginEmailField, invalidUserData.email);
  await I.fillField(AuthForm.loginPasswordField, invalidUserData.password);
  await I.click(AuthForm.loginSubmitButton);

  await I.waitForText('Your email or password is incorrect!', 5, AuthForm.loginForm);
  await I.dontSee(Header.loggedInText(invalidUserData.name));
});
