import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

test('setup: create admin storageState', async ({ page }) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const rawBaseUrl = process.env.BASE_URL;

    // 1. 🛡️ STRICT FAIL-FAST: No Hardcoded URLs allowed!
    if (!username || !password || !rawBaseUrl) {
        throw new Error('❌ FATAL: ADMIN_USERNAME, ADMIN_PASSWORD, or BASE_URL is missing in environment variables.');
    }

    // 2. Safely remove trailing slash to prevent double-slash (//) bugs
    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');

    // 3. Construct the exact Login URL
    const loginUrl = `${cleanBaseUrl}/web/index.php/auth/login`;

    console.log(`🚀 Navigating directly to: ${loginUrl}`);

    // 4. 🛡️ SENIOR MOVE: Direct Navigation with Extended Timeout (60s) for Docker Cold Boot in CI
    await page.goto(loginUrl, { timeout: 60000 });

    console.log('🔑 Filling credentials...');
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    console.log('⏳ Waiting for Dashboard and Auth Tokens...');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    console.log('💾 Saving session state...');
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });

    console.log(`✅ Session Saved Successfully at: ${AUTH_FILE_PATH}`);
});