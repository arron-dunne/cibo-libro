import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PW_BASE_URL ?? `http://localhost:${PORT}`;

// Use dev server locally for speed; in CI prefer a built server for stability.
const useBuiltServer = process.env.CI === 'true' || process.env.PW_USE_BUILD === '1';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,  
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  // project 1 runs a one-time auth setup that saves storageState
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/storage.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: useBuiltServer
    ? [
        { command: 'npm run build', reuseExistingServer: true },
        {
          command: `PORT=${PORT} npm run start`,
          url: BASE_URL,
          timeout: 120_000,
          reuseExistingServer: true,
        },
      ]
    : [
        {
          command: `PORT=${PORT} npm run dev`,
          url: BASE_URL,
          timeout: 120_000,
          reuseExistingServer: true,
        },
      ],
});
