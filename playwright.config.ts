import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: isCI ? 2 : 4,
  retries: isCI ? 1 : 0,

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results',

  use: {
    // 1. Global Base URL
    baseURL: process.env.BASE_URL,

    // 2. The most stable way to "maximize" in Playwright
    viewport: { width: 1920, height: 1080 },
  },

  globalSetup: require.resolve('./playwright/global-setup'),
  globalTeardown: require.resolve('./playwright/global-teardown'),

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },

    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json'
      },
    },
    {
      name: 'firefox',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/admin.json'
      },
    },
    {
      name: 'webkit',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/admin.json'
      },
    },
    {
      name: 'edge',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        storageState: 'playwright/.auth/admin.json'
      },
    },
  ],
});