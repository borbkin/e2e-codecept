import { LoginPage } from '../pages/LoginPage';
import { generateUserData } from '../utils/factories';
import { allureHelper as a } from '../utils/allureHelper';

Feature('Login page — негативные сценарии');

const invalidUserData = generateUserData();

Scenario('Ошибка при вводе некорректных email и пароля', async ({ I }) => {
  a.setEpic('Login');
  a.setStory('Негативные сценарии');
  a.setSeverity('critical');

  await a.step('Переход на страницу логина', async () => {
    await I.amOnPage(LoginPage.url);
    await I.acceptCookiesIfVisible();
  });

  await a.step('Вводим несуществующие email и пароль', async () => {
    await I.fillField(LoginPage.emailField, invalidUserData.email);
    await I.fillField(LoginPage.passwordField, invalidUserData.password);
  });

  await a.step('Нажимаем кнопку входа', async () => {
    await I.click(LoginPage.submitButton);
  });

  await a.step('Проверяем сообщение об ошибке', async () => {
    await I.waitForText('Your email or password is incorrect!', 5, '.login-form');
    await I.dontSee(LoginPage.loggedInText(invalidUserData.name));
  });
});