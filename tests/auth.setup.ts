import { test, expect } from '@playwright/test';
import fs from 'fs';

test('setup: create admin storageState', async ({ page }) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        throw new Error('Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env');
    }

    // Using your original URL approach
    await page.goto('http://localhost/orangehrm-5.8/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Validating login
    await expect(page).toHaveURL(/dashboard/);

    // Creating folder and saving session just like your original code
    await fs.promises.mkdir('playwright/.auth', { recursive: true });
    await page.context().storageState({ path: 'playwright/.auth/admin.json' });

    console.log('✅ Session Saved Successfully!');
});
