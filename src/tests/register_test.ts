import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';

Feature('Регистрация через интерфейс');

Scenario('Пользователь может зарегистрироваться через UI', async ({ I }) => {
  const name = 'UI User';
  const email = `uiuser_${Date.now()}@example.com`;
  const password = '123456';

  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(RegistrationPage.nameField, name);
  await I.fillField(RegistrationPage.emailField, email);
  await I.click(RegistrationPage.signupButton);

  await I.waitForElement(RegistrationPage.passwordField, 5);
  await I.fillField(RegistrationPage.passwordField, password);
  await I.selectOption(RegistrationPage.daySelect, '3');
  await I.selectOption(RegistrationPage.monthSelect, 'April');
  await I.selectOption(RegistrationPage.yearSelect, '1994');

  await I.fillField(RegistrationPage.firstNameField, 'Test');
  await I.fillField(RegistrationPage.lastNameField, 'User');
  await I.fillField(RegistrationPage.addressField, '123 Test Street');
  await I.selectOption(RegistrationPage.countrySelect, 'Canada');
  await I.fillField(RegistrationPage.stateField, 'Ontario');
  await I.fillField(RegistrationPage.cityField, 'Toronto');
  await I.fillField(RegistrationPage.zipcodeField, 'M1M1M1');
  await I.fillField(RegistrationPage.mobileField, '+1234567890');

  await I.click(RegistrationPage.createAccountButton);
  await I.waitForText(RegistrationPage.accountCreatedText, 10);
  await I.click(RegistrationPage.continueButton);

  await I.see(LoginPage.loggedInText(name));

  // Подчищаем после себя
  await I.logout();
  await I.deleteTestUser(email, password);
});