import { test, expect } from '@playwright/test';
import { t } from '@shared/i18n';     // example shared usage

test('GET GitHub Repo Data', async ({ request }) => {
  const response = await request.get('/repos/nodejs/node');

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  console.log('Repo stars:', data.stargazers_count);

  console.log(t('login.title'));
  expect(data.full_name).toBe('nodejs/node');
});
