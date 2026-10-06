import { test, expect } from '@playwright/test';

test.describe('Test Mode Security Gate (Normal Build)', () => {
  test('opening ?testMode=true without NEXT_PUBLIC_E2E_TEST_MODE=1 redirects unauthenticated visitor to /login', async ({ page }) => {
    // Navigate directly to the lesson page with testMode=true
    await page.goto('/quests/lesson?questId=python-lecture1-day-1&testMode=true');

    // In a normal build without the build-time flag NEXT_PUBLIC_E2E_TEST_MODE=1,
    // the bypass is strictly disabled. The unauthenticated visitor must be redirected to /login.
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
