import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'e2e-tests',
  outputDir: './e2e-tests-results',
  forbidOnly: !!process.env.CI,
  // Having to run Playwright in single-threaded mode locally
  // as some tests will time out without this:
  retries: process.env.CI ? 2 : 1,
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};
export default config;
