import { LoginPage } from './src/pages/LoginPage';
import { RegistrationPage } from './src/pages/RegistrationPage';
import { createUserViaAPI, deleteUserViaAPI } from './src/api/apiClient';

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
      this.say('Создаём пользователя через API');
      await createUserViaAPI({ name, email, password });
    },

    async logout(this: CodeceptJS.I) {
      try {
        await this.click(LoginPage.logoutLink);
        await this.see(LoginPage.loginTitle);
      } catch (e) {
        this.say('Пользователь не был залогинен — пропускаем logout');
      }
    },

    async deleteTestUser(this: CodeceptJS.I, email: string, password: string) {
      this.say(`Удаляем тестового пользователя ${email}`);
      await deleteUserViaAPI({ email, password });
    }
  });
};
