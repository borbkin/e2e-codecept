import { LoginPage } from '../pages/LoginPage';

Feature('Базовые смоук-сценарии');

Scenario('Открытие страницы логина', async ({ I }) => { 
  await I.amOnPage(LoginPage.url);
  await I.see(LoginPage.loginTitle);
});