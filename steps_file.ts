import { LoginPage } from './src/pages/LoginPage';
import { CookieBanner } from './src/fragments/CookieBanner';
import { TestUser } from './src/utils/testUser';
import { createUserViaAPI, deleteUserViaAPI } from './src/api/apiClient';

export = function() {
  return actor({
    async acceptCookiesIfVisible(this: CodeceptJS.I) {
      this.say('Пробуем закрыть баннер с cookies...');

      let bannerVisible = false;

      await this.usePlaywrightTo('проверить баннер cookies', async ({ page }) => {
        const consentButton = page.locator(CookieBanner.acceptButton).first();

        try {
          await consentButton.waitFor({ state: 'visible', timeout: 2000 });
          bannerVisible = true;
        } catch (error) {
          const isTimeoutError = error instanceof Error && error.name === 'TimeoutError';

          if (!isTimeoutError) {
            throw error;
          }
        }
      });

      if (!bannerVisible) {
        this.say('Баннер не появился — пропускаем');
        return;
      }

      this.say('Баннер найден, закрываем');
      await this.click(CookieBanner.acceptButton);
      await this.waitForInvisible(CookieBanner.acceptButton, 5);
    },

    async registerNewUser(this: CodeceptJS.I, user: TestUser) {
      this.say('Создаём пользователя через API');
      await createUserViaAPI(user);
    },

    async logout(this: CodeceptJS.I) {
      const logoutLinkVisible = await this.grabNumberOfVisibleElements(LoginPage.logoutLink);

      if (logoutLinkVisible === 0) {
        this.say('Пользователь не был залогинен — пропускаем logout');
        return;
      }

      await this.click(LoginPage.logoutLink);
      await this.see(LoginPage.loginTitle);
    },

    async deleteTestUser(this: CodeceptJS.I, email: string, password: string) {
      this.say(`Удаляем тестового пользователя ${email}`);
      await deleteUserViaAPI({ email, password });
    }
  });
};
