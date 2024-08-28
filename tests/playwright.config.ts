import { defineConfig, devices } from '@playwright/test';

const path = require('path');

export const featurePack1ZipFilePath = path.resolve('assets/fp-1.zip');
export const featurePack2ZipFilePath = path.resolve('assets/fp-2.zip');

export const LOGIN_USER_NAME = "dr-user";
export const LOGIN_PASSWORD = "Ericsson123!";

/**
 * Exporting response for baseUrl
 * (caution can be SED replacement
 * of http://dr.docker.localhost in
 * tests\docker\e2e_tests.sh)
 */
export const getBaseUrl = () => {
  return 'http://dr.docker.localhost/dr-ui/';  // ensure this is checked url
  // XXX return 'https://dr.anvil2-haber003.ews.gic.ericsson.se/dr-ui/';
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Time a test is allowed to run
  timeout: 60 * 1000,

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseUrl(),

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',

    ignoreHTTPSErrors: true,

  },

  expect: {
    // Max time expect() should wait for condition to be true.
    // For example how long to wait for 'await expect(locator).toHaveText();'
    timeout: 200 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
