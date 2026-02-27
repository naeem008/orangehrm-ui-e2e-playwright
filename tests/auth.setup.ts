import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 🛡️ Global path definition for cross-platform compatibility
const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

test('setup: create admin storageState', async ({ page }) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    // 1. 🚀 PRO APPROACH: Safely get the BASE_URL from .env or fallback to local XAMPP url
    const baseUrl = process.env.BASE_URL;

    if (!username || !password || !baseUrl) {
        throw new Error('❌ FATAL: ADMIN_USERNAME, ADMIN_PASSWORD, or BASE_URL missing in your .env file.');
    }

    console.log(`🚀 Navigating to base URL: ${baseUrl}`);

    // 2. Explicitly force Playwright to go to the correct URL
    await page.goto(baseUrl);

    // 3. Wait for OrangeHRM to redirect to the login page naturally
    await page.waitForURL('**/auth/login');

    console.log('🔑 Filling credentials...');
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    console.log('⏳ Waiting for Dashboard and Auth Tokens...');
    // 🛡️ State Readiness Check: Wait for the UI to fully load before saving state
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    console.log('💾 Saving session state...');
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });

    console.log(`✅ Session Saved Successfully at: ${AUTH_FILE_PATH}`);
});