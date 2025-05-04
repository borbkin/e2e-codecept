import { LoginPage } from '../pages/LoginPage';
import { generateUserData } from '../utils/factories';
import { allureHelper as a } from '../utils/allureHelper';
import { tag } from '../../plugins/tagFilterPlugin';

Feature('Login page — позитивные сценарии');

const userData = generateUserData();

Before(async ({ I }) => {
  await I.registerNewUser(userData.name, userData.email, userData.password);
});


Scenario('Пользователь может войти с валидными email и паролем', async ({ I }) => {
  tag('regression');
  a.setEpic('Login');
  a.setStory('Позитивный сценарий входа');
  a.setSeverity('blocker');

  await a.step('Открываем страницу логина', async () => {
    await I.amOnPage(LoginPage.url);
    await I.acceptCookiesIfVisible();
  });

  await a.step('Вводим валидные email и пароль', async () => {
    await I.fillField(LoginPage.emailField, userData.email);
    await I.fillField(LoginPage.passwordField, userData.password);
  });

  await a.step('Нажимаем кнопку входа', async () => {
    await I.click(LoginPage.submitButton);
  });

  await a.step('Проверяем успешный вход в систему', async () => {
    await I.waitForText('Logged in as', 10);
    await I.see(LoginPage.loggedInText(userData.name));
  });
});

After(async ({ I }) => {
  await I.logout();
  await I.deleteTestUser(userData.email, userData.password);
});