import { LoginPage } from '../pages/LoginPage';
import { allureHelper as a } from '../utils/allureHelper';
import { tag } from '../../plugins/tagFilter';

Feature('Login page — позитивные сценарии');

Scenario('Открытие страницы логина', async ({ I }) => {
  tag('smoke');  
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