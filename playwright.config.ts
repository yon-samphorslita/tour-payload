import { defineConfig, devices } from '@playwright/test'
import { TEST_BACKEND_URL } from './tests/helpers/testEnv'

/**
 * E2E tests run against `npm run test:server`: Payload on a throwaway in-memory MongoDB.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Tests share one database, so run them one at a time. */
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  /* The dev server compiles pages on first visit, which can be slow. */
  timeout: 90_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: TEST_BACKEND_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npm run test:server',
    url: `${TEST_BACKEND_URL}/api/health`,
    // Never reuse a running server: it could be connected to a real database.
    reuseExistingServer: false,
    timeout: 300_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
  },
})
