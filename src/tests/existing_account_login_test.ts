import { AuthForm } from '../fragments/AuthForm';
import { Header } from '../fragments/Header';
import { deleteUserViaAPI } from '../api/apiClient';
import { assertLoggedOut, loginThroughUi, openAuthPage } from '../helpers/authFlow';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Login with an existing account');

let registeredUser: TestUser;

Before(async ({ I }) => {
  registeredUser = buildTestUser();
  await I.registerNewUser(registeredUser);
});

Scenario('Вход с неверным паролем существующего пользователя отклоняется @regression @auth', async ({ I }) => {
  const wrongPassword = `${registeredUser.password}-wrong`;

  await openAuthPage(I);
  await I.fillField(AuthForm.loginEmailField, registeredUser.email);
  await I.fillField(AuthForm.loginPasswordField, wrongPassword);
  await I.click(AuthForm.loginSubmitButton, undefined, { noWaitAfter: true });

  await I.waitForText('Your email or password is incorrect!', 5, AuthForm.loginForm);
  await I.dontSee('Logged in as');
  await I.dontSee(Header.loggedInText(registeredUser.name));
});

Scenario('Выход сохраняется после повторного открытия страницы @regression @auth', async ({ I }) => {
  await openAuthPage(I);
  await loginThroughUi(I, registeredUser);

  await I.logout();
  await I.amOnPage('/');
  await I.waitForText(Header.signupOrLoginLink, 10);
  await I.dontSee('Logged in as');
  await I.dontSee(Header.loggedInText(registeredUser.name));

  await openAuthPage(I);
  await assertLoggedOut(I);
});

After(async () => {
  await deleteUserViaAPI(registeredUser);
});
