import { AuthForm } from '../fragments/AuthForm';
import { Header } from '../fragments/Header';
import { deleteUserViaAPI } from '../api/apiClient';
import { openAuthPage } from '../helpers/authFlow';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Login page');

Scenario('Открытие страницы логина @regression @auth', async ({ I }) => {
  await openAuthPage(I);
  await I.see(AuthForm.loginTitle);
});

Scenario('Негативный вход по email и паролю @regression @auth', async ({ I }) => {
  const invalidUserData = buildTestUser();

  await openAuthPage(I);

  await I.fillField(AuthForm.loginEmailField, invalidUserData.email);
  await I.fillField(AuthForm.loginPasswordField, invalidUserData.password);
  await I.click(AuthForm.loginSubmitButton, undefined, { noWaitAfter: true });

  await I.waitForText('Your email or password is incorrect!', 5, AuthForm.loginForm);
  await I.dontSee(Header.loggedInText(invalidUserData.name));
});

Scenario('Форма логина требует email @regression @auth', async ({ I }) => {
  const user = buildTestUser();

  await openAuthPage(I);
  await I.fillField(AuthForm.loginPasswordField, user.password);

  await I.usePlaywrightTo('проверить native validation обязательного email', async ({ page }) => {
    const loginUrl = page.url();
    const emailField = page.locator(AuthForm.loginEmailField);

    await page.locator(AuthForm.loginSubmitButton).click();

    const validity = await emailField.evaluate(element => {
      const input = element as HTMLInputElement;
      return { valid: input.checkValidity(), valueMissing: input.validity.valueMissing };
    });

    if (validity.valid || !validity.valueMissing) {
      throw new Error('Email field should report valueMissing when submitted empty');
    }

    if (page.url() !== loginUrl) {
      throw new Error(`Login form navigated after native validation: ${page.url()}`);
    }
  });

  await I.see(AuthForm.loginTitle, AuthForm.loginForm);
});

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

After(async () => {
  await deleteUserViaAPI(registeredUser);
});
