import { AuthForm } from '../fragments/AuthForm';
import { deleteAccountThroughUi, loginThroughUi, openAuthPage, submitSignupForm, assertLoggedOut } from '../helpers/authFlow';
import { deleteUserViaAPI } from '../api/apiClient';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Auth smoke');

let accountToClean: TestUser | undefined;

Before(() => {
  accountToClean = undefined;
});

// API teardown runs even when browser steps or account creation fail.
After(async () => {
  if (accountToClean) {
    await deleteUserViaAPI(accountToClean);
  }
});

Scenario('Пользователь может выйти из аккаунта @smoke @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  accountToClean = user;
  await I.registerNewUser(user);

  await openAuthPage(I);
  await loginThroughUi(I, user);

  await I.logout();
  await assertLoggedOut(I);
});

Scenario('Пользователь видит ошибку при повторной регистрации с существующим email @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  accountToClean = user;
  await I.registerNewUser(user);

  await openAuthPage(I);
  await submitSignupForm(I, user);

  await I.waitForText(AuthForm.duplicateEmailError, 10, AuthForm.signupForm);
  await I.see(AuthForm.duplicateEmailError, AuthForm.signupForm);
});

Scenario('Пользователь может удалить аккаунт через UI @smoke @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  accountToClean = user;
  await I.registerNewUser(user);

  await openAuthPage(I);
  await loginThroughUi(I, user);
  await deleteAccountThroughUi(I);
});

Scenario('Форма логина валидирует обязательный пароль @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  await openAuthPage(I);

  await I.fillField(AuthForm.loginEmailField, user.email);
  await I.click(AuthForm.loginSubmitButton);

  await I.usePlaywrightTo('проверить native validation для обязательного пароля', async ({ page }) => {
    const passwordField = page.locator(AuthForm.loginPasswordField);
    const validationMessage = await passwordField.evaluate(
      element => (element as HTMLInputElement).validationMessage
    );
    const isInvalid = await passwordField.evaluate(element => !(element as HTMLInputElement).checkValidity());

    if (!isInvalid) {
      throw new Error('Password field should be invalid when submitted empty');
    }

    if (!validationMessage) {
      throw new Error('Password field should show a native validation message');
    }
  });

  await I.see(AuthForm.loginTitle, AuthForm.loginForm);
});
