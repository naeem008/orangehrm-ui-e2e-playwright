import { test, expect } from '@playwright/test';
import { NavbarPage } from '../pages/navbar.page';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Session Management', () => {
    test('Should successfully logout and destroy UI session', async ({ page }) => {
        await page.goto('/web/index.php/auth/login', {
            waitUntil: 'domcontentloaded',
        });

        const usernameInput = page.getByPlaceholder('Username');
        await expect(usernameInput).toBeVisible({ timeout: 15000 });

        await usernameInput.fill(process.env.ADMIN_USERNAME as string);
        await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD as string);

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

        const navbar = new NavbarPage(page);
        await navbar.logout();

        await expect(page).toHaveURL(/.*auth\/login/, { timeout: 15000 });
        await expect(page.getByPlaceholder('Username')).toBeVisible();
    });
});
