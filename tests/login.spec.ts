import { test, expect } from '@playwright/test';

test('smoke: dashboard opens with saved session', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });

    // should not redirect to login
    await expect(page).not.toHaveURL(/auth\/login/i);

    // optional: confirm dashboard visible
    const dash = page.getByRole('heading', { name: /dashboard/i });
    if ((await dash.count()) > 0) await expect(dash.first()).toBeVisible();
});
