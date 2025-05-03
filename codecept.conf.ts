import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
import { RegistrationPage } from './src/pages/RegistrationPage';

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './src/tests/**/*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      trace: true,
      keepTraceForPassedTests: false,
      fullPageScreenshots: true,
      waitForNavigation: 'domcontentloaded',
      url: 'https://automationexercise.com',
      show: process.env.HEADLESS !== 'true'
    }
  },
  include: {
    I: './steps_file',
    LoginPage: './src/pages/LoginPage.ts',
    RegistrationPage: './src/pages/RegistrationPage.ts'
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true,
      retries: 1
    },
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      outputDir: 'allure-results',
      useCucumberStepReporter: false
    }
  },
  name: 'e2e-codecept'
};