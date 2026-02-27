import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 🛡️ Global path definition - safe for both Windows and Linux
const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

test('setup: create admin storageState', async ({ page }) => {
    // 1. Fetch Environment Variables
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const rawBaseUrl = process.env.BASE_URL;

    // Validate variables immediately (Fail-Fast)
    if (!username || !password || !rawBaseUrl) {
        throw new Error('❌ FATAL: ADMIN_USERNAME, ADMIN_PASSWORD, or BASE_URL is missing in environment variables.');
    }

    // 2. URL Sanitization - prevents double-slash (//) bugs
    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');
    const loginUrl = `${cleanBaseUrl}/web/index.php/auth/login`;

    console.log(`🚀 Navigating directly to: ${loginUrl}`);

    // Direct navigation with 60s timeout to handle CI/CD Docker cold boot
    await page.goto(loginUrl, { timeout: 60000 });

    // 3. Wait for the form to be ready - satisfies 'no-wait-for-selector' lint
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    await usernameField.waitFor({ state: 'visible', timeout: 15000 });

    console.log('🔑 Filling credentials...');
    await usernameField.fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. 🛡️ SMART VALIDATION: Satisfies 'preserve-caught-error' lint
    const invalidCredentialsMsg = page.locator('.oxd-alert-content-text');

    try {
        console.log('⏳ Waiting for Dashboard and Auth Tokens...');
        // Wait for dashboard URL and heading to ensure state is ready
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        console.log('✅ Login successful.');
    } catch (error: any) {
        // If login fails, check for the specific error message UI
        const isInvalid = await invalidCredentialsMsg.isVisible();
        if (isInvalid) {
            const errorText = await invalidCredentialsMsg.innerText();
            // ✅ FIX: Throwing with 'cause' to satisfy lint
            throw new Error(`❌ AUTH FAILED: System returned "${errorText}".`, { cause: error });
        }
        // If not an invalid credential error, re-throw the original timeout/navigation error
        throw error;
    }

    // 5. Finalize Session Storage
    console.log('💾 Saving session state...');
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });

    console.log(`✅ Session Saved Successfully at: ${AUTH_FILE_PATH}`);
});