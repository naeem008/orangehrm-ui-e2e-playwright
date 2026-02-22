import { test, expect } from '@playwright/test';

test('smoke: can open PIM employee list', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, { waitUntil: 'domcontentloaded' });

    // should not redirect to login
    await expect(page).not.toHaveURL(/auth\/login/i);

    // stable URL assertion
    await expect(page).toHaveURL(/pim\/viewEmployeeList/i);
});