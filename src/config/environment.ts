import { devices } from 'playwright';

type PlaywrightDevice = (typeof devices)[keyof typeof devices];

export type TestProfile = 'local' | 'ci' | 'mobile';

export interface EnvironmentConfig {
  profile: TestProfile;
  baseURL: string;
  headless: boolean;
  mobileDeviceName?: string;
  mobileDevice?: PlaywrightDevice;
}

const DEFAULT_BASE_URL = 'https://automationexercise.com';
const DEFAULT_MOBILE_DEVICE = 'Pixel 7';

export function loadEnvironment(
  env: NodeJS.ProcessEnv = process.env,
  profileOverride?: TestProfile
): EnvironmentConfig {
  const requestedProfile = profileOverride ?? env.TEST_PROFILE;
  const profile = requestedProfile ?? (env.CI === 'true' ? 'ci' : 'local');

  if (profile !== 'local' && profile !== 'ci' && profile !== 'mobile') {
    throw new Error(`Invalid TEST_PROFILE "${profile}". Expected local, ci, or mobile.`);
  }

  if (env.HEADLESS !== undefined && env.HEADLESS !== 'true' && env.HEADLESS !== 'false') {
    throw new Error(`Invalid HEADLESS "${env.HEADLESS}". Expected true or false.`);
  }

  const headless = env.HEADLESS === undefined ? profile !== 'local' : env.HEADLESS === 'true';
  const baseURL = normalizeBaseURL(env.BASE_URL ?? DEFAULT_BASE_URL);
  const config: EnvironmentConfig = { profile, baseURL, headless };

  if (profile === 'mobile') {
    const mobileDeviceName = env.MOBILE_DEVICE ?? DEFAULT_MOBILE_DEVICE;
    const mobileDevice = devices[mobileDeviceName];
    if (!mobileDevice || mobileDevice.defaultBrowserType !== 'chromium' || !mobileDevice.isMobile || !mobileDevice.hasTouch) {
      throw new Error(
        `Unsupported MOBILE_DEVICE "${mobileDeviceName}". Choose a known Playwright Chromium mobile device.`
      );
    }
    config.mobileDeviceName = mobileDeviceName;
    config.mobileDevice = mobileDevice;
  }

  return config;
}

export function normalizeBaseURL(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid BASE_URL "${value}". Expected an absolute http or https URL.`);
  }

  if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname || url.username || url.password) {
    throw new Error(`Invalid BASE_URL "${value}". Expected an absolute http or https URL.`);
  }
  // URL.search/hash are empty for a bare '?' or '#', but those delimiters
  // still break CodeceptJS relative-path concatenation.
  if (url.href.includes('?') || url.href.includes('#')) {
    throw new Error(`Invalid BASE_URL "${value}". Query strings and fragments are not supported.`);
  }

  url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  return url.toString();
}

export function buildURL(path: string, env: NodeJS.ProcessEnv = process.env): string {
  const { baseURL } = loadEnvironment(env);
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith('//')) {
    throw new Error(`Expected a path relative to BASE_URL, got "${path}".`);
  }
  return new URL(path.replace(/^\/+/, ''), baseURL).toString();
}
