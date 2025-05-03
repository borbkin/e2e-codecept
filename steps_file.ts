import { LoginPage } from './src/pages/LoginPage';
import { RegistrationPage } from './src/pages/RegistrationPage';

export = function() {
  return actor({
    async acceptCookiesIfVisible(this: CodeceptJS.I) {
      this.say('Пробуем закрыть баннер с cookies...');
    
      // подождём чуть больше, но не обязательно
      await this.wait(2);
    
      const count = await this.grabNumberOfVisibleElements(LoginPage.cookiesConsentButton);
      if (count > 0) {
        this.say('Баннер найден, закрываем');
        await this.click(LoginPage.cookiesConsentButton);
      } else {
        this.say('Баннер не появился — пропускаем');
      }
    },

    async registerNewUser(this: CodeceptJS.I, name: string, email: string, password: string) {
      await this.amOnPage(LoginPage.url);
      await this.acceptCookiesIfVisible();

      await this.fillField(RegistrationPage.nameField, name);
      await this.fillField(RegistrationPage.emailField, email);
      await this.click(RegistrationPage.signupButton);

      await this.waitForElement(RegistrationPage.passwordField, 5);
      await this.fillField(RegistrationPage.passwordField, password);
      await this.selectOption(RegistrationPage.daySelect, '3');
      await this.selectOption(RegistrationPage.monthSelect, 'April');
      await this.selectOption(RegistrationPage.yearSelect, '1994');

      await this.fillField(RegistrationPage.firstNameField, 'Test');
      await this.fillField(RegistrationPage.lastNameField, 'User');
      await this.fillField(RegistrationPage.addressField, '123 Test Street');
      await this.selectOption(RegistrationPage.countrySelect, 'Canada');
      await this.fillField(RegistrationPage.stateField, 'Ontario');
      await this.fillField(RegistrationPage.cityField, 'Toronto');
      await this.fillField(RegistrationPage.zipcodeField, 'M1M1M1');
      await this.fillField(RegistrationPage.mobileField, '+1234567890');

      await this.click(RegistrationPage.createAccountButton);
      await this.waitForText(RegistrationPage.accountCreatedText, 10);
      await this.click(RegistrationPage.continueButton);

      await this.see(LoginPage.loggedInText(name));
      await this.logout();
    },

    async login(this: CodeceptJS.I, email: string, password: string) {
      await this.amOnPage(LoginPage.url);
      await this.acceptCookiesIfVisible();

      await this.fillField(LoginPage.emailField, email);
      await this.fillField(LoginPage.passwordField, password);
      await this.click(LoginPage.submitButton);

      await this.waitForText('Logged in as', 10);
    },

    async logout(this: CodeceptJS.I) {
      try {
        await this.click(LoginPage.logoutLink);
        await this.see(LoginPage.loginTitle);
      } catch (e) {
        this.say('Пользователь не был залогинен — пропускаем logout');
      }
    }
  });
};