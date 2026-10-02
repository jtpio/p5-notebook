const baseConfig = require('@jupyterlab/galata/lib/playwright-config');

module.exports = {
  ...baseConfig,
  retries: process.env.CI ? 1 : 0,
  expect: {
    // p5.js is fetched from a CDN before a sketch can draw
    timeout: 30000
  },
  use: {
    ...baseConfig.use,
    appPath: '',
    autoGoto: false,
    baseURL: 'http://localhost:8000'
  },
  webServer: {
    command: 'jlpm start',
    url: 'http://localhost:8000/lab/index.html',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
};
