import { AuthForm } from '../fragments/AuthForm';
import { deleteAccountThroughUi, loginThroughUi, openAuthPage, submitSignupForm, assertLoggedOut } from '../helpers/authFlow';
import { buildTestUser } from '../utils/testUser';

Feature('Auth smoke');

Scenario('Пользователь может выйти из аккаунта @smoke @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  try {
    await I.registerNewUser(user);

    await openAuthPage(I);
    await loginThroughUi(I, user);

    await I.logout();
    await assertLoggedOut(I);
  } finally {
    await I.deleteTestUser(user.email, user.password);
  }
});

Scenario('Пользователь видит ошибку при повторной регистрации с существующим email @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  try {
    await I.registerNewUser(user);

    await openAuthPage(I);
    await submitSignupForm(I, user);

    await I.waitForText(AuthForm.duplicateEmailError, 10, AuthForm.signupForm);
    await I.see(AuthForm.duplicateEmailError, AuthForm.signupForm);
  } finally {
    await I.deleteTestUser(user.email, user.password);
  }
});

Scenario('Пользователь может удалить аккаунт через UI @smoke @regression @auth', async ({ I }) => {
  const user = buildTestUser();
  let accountDeletedViaUi = false;

  try {
    await I.registerNewUser(user);

    await openAuthPage(I);
    await loginThroughUi(I, user);
    await deleteAccountThroughUi(I);
    accountDeletedViaUi = true;
  } finally {
    if (!accountDeletedViaUi) {
      await I.deleteTestUser(user.email, user.password);
    }
  }
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
