import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { buildTestUser, TestUser } from '../utils/testUser';

Feature('Регистрация через интерфейс');

let userData: TestUser;

Before(() => {
  userData = buildTestUser();
});

Scenario('Пользователь может зарегистрироваться через UI', async ({ I }) => {
  await I.amOnPage(LoginPage.url);
  await I.acceptCookiesIfVisible();

  await I.fillField(RegistrationPage.nameField, userData.name);
  await I.fillField(RegistrationPage.emailField, userData.email);
  await I.click(RegistrationPage.signupButton);

  await I.waitForElement(RegistrationPage.passwordField, 5);
  await I.fillField(RegistrationPage.passwordField, userData.password);
  await I.selectOption(RegistrationPage.daySelect, userData.birthDay);
  await I.selectOption(RegistrationPage.monthSelect, userData.birthMonth);
  await I.selectOption(RegistrationPage.yearSelect, userData.birthYear);

  await I.fillField(RegistrationPage.firstNameField, userData.firstName);
  await I.fillField(RegistrationPage.lastNameField, userData.lastName);
  await I.fillField(RegistrationPage.addressField, userData.address);
  await I.selectOption(RegistrationPage.countrySelect, userData.country);
  await I.fillField(RegistrationPage.stateField, userData.state);
  await I.fillField(RegistrationPage.cityField, userData.city);
  await I.fillField(RegistrationPage.zipcodeField, userData.zipcode);
  await I.fillField(RegistrationPage.mobileField, userData.mobileNumber);

  await I.click(RegistrationPage.createAccountButton);
  await I.waitForText(RegistrationPage.accountCreatedText, 10);
  await I.click(RegistrationPage.continueButton);

  await I.see(LoginPage.loggedInText(userData.name));
});

After(async ({ I }) => {
  // Удаляем тестового пользователя, если он был создан
  await I.logout();
  await I.deleteTestUser(userData.email, userData.password);
});
