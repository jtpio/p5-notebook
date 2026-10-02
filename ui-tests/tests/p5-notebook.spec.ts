import { expect, test } from '@jupyterlab/galata';

import type { Page } from '@playwright/test';

/**
 * Wait for a selector instead of the JupyterLab launcher.
 *
 * The Notebook pages have no launcher, so the default Galata check never resolves.
 */
function waitForSelector(selector: string) {
  return async ({ baseURL }: { baseURL?: string }, use: any) => {
    await use(async (page: Page) => {
      await page.locator(selector).first().waitFor();
    });
  };
}

test.describe('Notebook', () => {
  test.use({ waitForApplication: waitForSelector('#filebrowser') });

  test('the tree page shows the p5 logo, theme and demo files', async ({
    page
  }) => {
    await page.goto('tree/index.html');

    await expect(
      page.locator('#jp-MainLogo [data-icon="p5-notebook:square-icon"]')
    ).toBeVisible();
    expect(await page.theme.getTheme()).toBe('p5.js Light');
    await expect(
      page.locator('.jp-DirListing-itemText', { hasText: 'intro.ipynb' })
    ).toBeVisible();
  });

  test.describe('intro.ipynb', () => {
    test.use({ waitForApplication: waitForSelector('.jp-NotebookPanel') });

    test('runs the sketch with the p5.js kernel', async ({ page }) => {
      await page.goto('notebooks/index.html?path=intro.ipynb');

      await expect(page.locator('.jp-KernelName')).toHaveText('p5.js');
      await expect(
        page.locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
      ).toBeVisible();

      await page.menu.clickMenuItem('Run>Run All Cells');

      await expect(
        page.locator('.jp-OutputArea-output iframe').first()
      ).toBeVisible();
      await expect(
        page
          .frameLocator('.jp-OutputArea-output iframe')
          .first()
          .locator('canvas')
      ).toBeVisible();
    });
  });
});

test.describe('JupyterLab', () => {
  test('loads with the p5 logo and the p5.js kernel', async ({ page }) => {
    await page.goto('lab/index.html');

    await expect(
      page.locator('#jp-MainLogo [data-icon="p5-notebook:asterisk-icon"]')
    ).toBeVisible();
    expect(await page.theme.getTheme()).toBe('p5.js Light');

    await page
      .locator('.jp-LauncherCard[data-category="Notebook"][title="p5.js"]')
      .first()
      .click();
    await page.locator('#jp-main-statusbar').getByText('Idle').waitFor();

    await page.notebook.setCell(
      0,
      'code',
      'function setup() {\n  createCanvas(100, 100);\n  background(237, 34, 93);\n}'
    );
    await page.notebook.addCell('code', '%show');
    await page.notebook.run();

    await expect(
      page
        .frameLocator('.jp-OutputArea-output iframe')
        .first()
        .locator('canvas')
    ).toBeVisible();
  });

  test('registers the p5.js themes', async ({ page }) => {
    await page.goto('lab/index.html');

    await page.theme.setTheme('p5.js Dark');
    expect(await page.theme.getTheme()).toBe('p5.js Dark');
    await expect(page.locator('body')).toHaveAttribute(
      'data-jp-theme-light',
      'false'
    );

    await page.theme.setTheme('p5.js Light');
    expect(await page.theme.getTheme()).toBe('p5.js Light');
  });
});

test.describe('New notebook', () => {
  test.use({ waitForApplication: waitForSelector('#filebrowser') });

  test('starts the p5.js kernel by default', async ({ page }) => {
    await page.goto('tree/index.html');

    const [notebook] = await Promise.all([
      page.waitForEvent('popup'),
      page.menu.clickMenuItem('File>New>Notebook')
    ]);

    await expect(notebook.locator('.jp-KernelName')).toHaveText('p5.js');
    await expect(notebook.locator('.jp-Dialog')).toHaveCount(0);
  });
});
