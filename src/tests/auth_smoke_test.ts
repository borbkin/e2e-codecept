import { LoginPage } from '../pages/LoginPage';
import { buildTestUser } from '../utils/testUser';

Feature('Auth smoke');

Scenario('Пользователь может выйти из аккаунта', async ({ I }) => {
  const user = buildTestUser();

  try {
    await I.registerNewUser(user);

    await I.amOnPage(LoginPage.url);
    await I.acceptCookiesIfVisible();

    await I.fillField(LoginPage.emailField, user.email);
    await I.fillField(LoginPage.passwordField, user.password);
    await I.click(LoginPage.submitButton);

    await I.waitForText('Logged in as', 10);
    await I.see(LoginPage.loggedInText(user.name));

    await I.logout();
    await I.see(LoginPage.loginTitle, LoginPage.loginForm);
  } finally {
    await I.deleteTestUser(user.email, user.password);
  }
});

Scenario('Пользователь видит ошибку при повторной регистрации с существующим email', async ({ I }) => {
  const user = buildTestUser();

  try {
    await I.registerNewUser(user);

    await I.amOnPage(LoginPage.url);
    await I.acceptCookiesIfVisible();

    await I.fillField(LoginPage.signupName, user.name);
    await I.fillField(LoginPage.signupEmail, user.email);
    await I.click(LoginPage.signupButton);

    await I.waitForText(LoginPage.duplicateEmailError, 10, LoginPage.signupForm);
    await I.see(LoginPage.duplicateEmailError, LoginPage.signupForm);
  } finally {
    await I.deleteTestUser(user.email, user.password);
  }
});

Scenario('Пользователь может удалить аккаунт через UI', async ({ I }) => {
  const user = buildTestUser();

  await I.registerNewUser(user);

  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, user.email);
  await I.fillField(LoginPage.passwordField, user.password);
  await I.click(LoginPage.submitButton);

  await I.waitForText('Logged in as', 10);
  await I.see(LoginPage.deleteAccountLink);

  await I.click(LoginPage.deleteAccountLink);
  await I.waitForText(LoginPage.accountDeletedMessage, 10);
  await I.see(LoginPage.accountDeletedMessage);
  await I.click(LoginPage.continueButton);
  await I.see(LoginPage.signupOrLoginLink);
});

Scenario('Форма логина валидирует обязательный пароль', async ({ I }) => {
  const user = buildTestUser();

  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, user.email);
  await I.click(LoginPage.submitButton);

  await I.usePlaywrightTo('проверить native validation для обязательного пароля', async ({ page }) => {
    const passwordField = page.locator(LoginPage.passwordField);
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

  await I.see(LoginPage.loginTitle, LoginPage.loginForm);
});
