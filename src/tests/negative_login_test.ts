import { LoginPage } from '../pages/LoginPage';
import { generateUserData } from '../utils/factories';

Feature('Login page — негативные сценарии');

const invalidUserData = generateUserData();

Scenario('Ошибка при вводе некорректных email и пароля', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(LoginPage.emailField, invalidUserData.email);
  await I.fillField(LoginPage.passwordField, invalidUserData.password);
  
  await I.click(LoginPage.submitButton);
  
  await I.waitForText('Your email or password is incorrect!', 5, '.login-form');
  await I.dontSee(LoginPage.loggedInText(invalidUserData.name));
  
});