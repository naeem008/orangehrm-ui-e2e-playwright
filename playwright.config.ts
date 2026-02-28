import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  // Global test directory for actual specs
  testDir: './tests',
  fullyParallel: true,
  // Capstone spec: Parallel execution
  workers: isCI ? 2 : 1,
  retries: isCI ? 1 : 0,

  // Capstone spec: Monocart HTML reporter
  reporter: [
    ['list'],
    ['monocart-reporter', {
      name: 'OrangeHRM E2E Automation Report',
      outputFile: './playwright-report/index.html'
    }]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    viewport: { width: 1920, height: 1080 },
    // Capstone spec: Playwright trace on failure
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  // Capstone spec: Local Server Automation (Paths updated to match clean architecture)
  globalSetup: require.resolve('./scripts/global-setup.ts'),
  globalTeardown: require.resolve('./scripts/global-teardown.ts'),

  projects: [
    {
      name: 'setup',
      testDir: './setups',
      testMatch: 'auth.setup.ts' // 🛡️ CRITICAL FIX: Only auth setup is treated as a test file
    },
    // Capstone spec: Multi-browser (minimum 4)
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