import { test, expect } from '@playwright/test';
import { t, initI18n } from '@shared/i18n';
import { log } from '@shared/logger';

test('homepage should load and show correct title text', async ({ page }) => {
  initI18n('fr');
  log('Running Playwright test…');

  await page.goto('https://example.com');

  // using shared i18n lib
  console.log('Translated title =', t('login.title'));

  const title = await page.title();
  expect(title).toContain('Example');
});
