import { test, expect } from '@playwright/test';
import { NavbarPage } from '../pages/navbar.page';

// 🛡️ SENIOR MOVE: Isolate this test from the global auth state. 
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Session Management', () => {
    test('Should successfully logout and destroy UI session', async ({ page }) => {
        // 1. Manually login first since we isolated the state
        await page.goto('/web/index.php/auth/login');

        // 🛡️ SENIOR FIX: Wait for XAMPP to finish loading the page completely
        await page.waitForLoadState('networkidle');
        const usernameInput = page.getByPlaceholder('Username');
        await expect(usernameInput).toBeVisible({ timeout: 15000 });

        await usernameInput.fill(process.env.ADMIN_USERNAME as string);
        await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD as string);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/.*dashboard/);

        // 2. Perform Logout
        const navbar = new NavbarPage(page);
        await navbar.logout();

        // 3. Verify successful logout
        await expect(page).toHaveURL(/.*auth\/login/);
    });
});