import { EnvironmentConfig, loadEnvironment } from './environment';

export function createCodeceptConfig(environment: EnvironmentConfig = loadEnvironment()): CodeceptJS.MainConfig {
  const playwrightConfig: Record<string, unknown> = {
    browser: 'chromium',
    trace: true,
    keepTraceForPassedTests: false,
    fullPageScreenshots: true,
    uniqueScreenshotNames: true,
    recordHar: {
      path: 'output/network.har'
    },
    waitForNavigation: 'commit',
    // CodeceptJS appends relative paths directly to helper.url. Keep the
    // canonical BASE_URL slash in the environment parser, but trim it here.
    url: environment.baseURL.replace(/\/$/, ''),
    show: !environment.headless
  };

  if (environment.mobileDevice) {
    playwrightConfig.emulate = environment.mobileDevice;
  } else {
    playwrightConfig.windowSize = '1200x900';
  }

  return {
    tests: './src/tests/**/*_test.ts',
    output: './output',
    helpers: {
      Playwright: playwrightConfig,
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
}
