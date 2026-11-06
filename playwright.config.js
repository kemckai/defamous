// Playwright config for Defamous content-script regression tests.
// Runs the same scenarios in WebKit (Safari engine) and Chromium
// so Safari regressions surface alongside Chrome behavior.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },
  webServer: {
    command: 'node tests/support/server.js',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
