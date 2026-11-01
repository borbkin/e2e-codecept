import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';

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
      uniqueScreenshotNames: true,
      recordHar: { 
        path: 'output/network.har' 
      },
      windowSize: '1200x900',
      // Auth assertions wait for the required UI; third-party resources must not gate navigation.
      waitForNavigation: 'commit',
      url: 'https://automationexercise.com',
      show: process.env.HEADLESS !== 'true',
    },
    NetworkIsolation: {
      require: './src/helpers/NetworkIsolation.ts'
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
