import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

test('setup: create admin storageState', async ({ page }) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const rawBaseUrl = process.env.BASE_URL;

    if (!username || !password || !rawBaseUrl) {
        throw new Error('❌ FATAL: ADMIN_USERNAME, ADMIN_PASSWORD, or BASE_URL is missing.');
    }

    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');
    const loginUrl = `${cleanBaseUrl}/web/index.php/auth/login`;

    console.log(`🚀 Navigating directly to: ${loginUrl}`);
    await page.goto(loginUrl, { timeout: 60000 });

    // 1. 🛡️ SENIOR MOVE: Wait for the form to be visible before interacting
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    await usernameField.waitFor({ state: 'visible', timeout: 15000 });

    console.log('🔑 Filling credentials...');
    await usernameField.fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. 🕵️‍♂️ SMART VALIDATION: Check for Success OR Invalid Credentials
    // We wait for either the dashboard OR the error message to appear
    const invalidCredentialsMsg = page.locator('.oxd-alert-content-text');

    try {
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
        console.log('✅ Login successful, Dashboard reached.');
    } catch (error) {
        // If dashboard doesn't load, check if "Invalid credentials" is visible
        if (await invalidCredentialsMsg.isVisible()) {
            const errorText = await invalidCredentialsMsg.innerText();
            throw new Error(`❌ AUTH FAILED: The system returned "${errorText}". Check your GitHub Secrets/env variables.`);
        }
        throw error; // Rethrow if it's some other timeout/error
    }

    // 3. Finalize Session
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });

    console.log('💾 Session Saved Successfully!');
});