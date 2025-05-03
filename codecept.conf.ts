import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';

// Автоматическое скрытие браузера при запуске с HEADLESS=true
setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/**/*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://automationexercise.com',
      show: process.env.HEADLESS !== 'true'
    }
  },
  include: {
    I: './steps_file'
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 1
    }
  },
  name: 'e2e-codecept',
};