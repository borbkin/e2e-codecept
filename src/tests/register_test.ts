import { assertLoggedIn, completeAccountConfirmation, completeRegistrationForm, openAuthPage, submitSignupForm } from '../helpers/authFlow';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Регистрация через интерфейс');

let userData: TestUser;

Before(() => {
  userData = buildTestUser();
});

Scenario('Пользователь может зарегистрироваться через UI @smoke @regression @auth', async ({ I }) => {
  await openAuthPage(I);
  await submitSignupForm(I, userData);
  await completeRegistrationForm(I, userData);
  await completeAccountConfirmation(I);
  await assertLoggedIn(I, userData.name);
});

After(async ({ I }) => {
  // Удаляем тестового пользователя, если он был создан
  await I.logout();
  await I.deleteTestUser(userData.email, userData.password);
});
