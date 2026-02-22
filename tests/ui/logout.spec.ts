import { test, expect } from '@playwright/test';
import { NavbarPage } from '../../pages/navbar.page';

test.describe('Session Management', () => {

    test('Should successfully logout and destroy UI session', async ({ page }) => {
        // 1. Go to dashboard (Uses saved session from admin.json)
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });

        const navbar = new NavbarPage(page);

        // 2. Perform Logout
        await navbar.logout();

        // 3. Verify Session is deleted (Redirected to Login page)
        await expect(page).toHaveURL(/login/);

        const loginTitle = page.getByRole('heading', { name: 'Login' });
        await expect(loginTitle).toBeVisible();

        console.log('UI Session destroyed successfully via Logout');
    });

});