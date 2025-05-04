import { LoginPage } from '../pages/LoginPage';
import { generateUserData } from '../utils/factories';
import { allureHelper as a } from '../utils/allureHelper';

Feature('Login page — позитивные сценарии');

// @ui @positive @smoke
Scenario('Открытие страницы логина', async ({ I }) => {
  a.setEpic('Login');
  a.setStory('Негативные сценарии');
  a.setSeverity('critical');

  await a.step('Открываем страницу логина', async () => {
    await I.amOnPage(LoginPage.url);
  });

  await a.step('Проверяем наличие заголовка страницы', async () => {
    await I.see(LoginPage.loginTitle);
  });
});