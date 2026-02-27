import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

// 🛡️ PRE-CONDITION: Fetching environment variables
const username = process.env.ADMIN_USERNAME || '';
const password = process.env.ADMIN_PASSWORD || '';
const rawBaseUrl = process.env.BASE_URL || '';

test('setup: create admin storageState', async ({ page }) => {
    // 1. Strict Validation (Satisfies lint: no-conditional-in-test)
    expect(username, '❌ ADMIN_USERNAME is missing').not.toBe('');
    expect(password, '❌ ADMIN_PASSWORD is missing').not.toBe('');
    expect(rawBaseUrl, '❌ BASE_URL is missing').not.toBe('');

    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');

    /**
     * 🕵️‍♂️ SENIOR MOVE: URL Auto-Discovery logic
     * Handles the 404 error seen in GitHub Actions
     */
    let loginUrl = `${cleanBaseUrl}/web/index.php/auth/login`;
    console.log(`🚀 Primary navigation attempt: ${loginUrl}`);

    let response = await page.goto(loginUrl, { timeout: 60000 });

    // 🛡️ If 404 is detected, retry without the subfolder
    if (response?.status() === 404) {
        console.log('⚠️ 404 Detected! Retrying at root level (CI Docker mode)...');
        const rootUrl = new URL(cleanBaseUrl).origin; // Gets 'http://localhost:8080'
        loginUrl = `${rootUrl}/web/index.php/auth/login`;
        console.log(`🚀 Secondary navigation attempt: ${loginUrl}`);
        response = await page.goto(loginUrl, { timeout: 60000 });
    }

    // Ensure the page actually loaded
    expect(response?.ok(), `❌ Failed to load login page at ${loginUrl}`).toBeTruthy();

    // 2. Form Interaction
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });

    console.log('🔑 Filling credentials...');
    await usernameField.fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 3. Smart Validation & Error Handling (Satisfies all lint rules)
    const invalidCredentialsMsg = page.locator('.oxd-alert-content-text');

    try {
        console.log('⏳ Waiting for Dashboard...');
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        console.log('✅ Login successful.');
    } catch (error: unknown) {
        // Handle explicit authentication failure
        const isInvalid = await invalidCredentialsMsg.isVisible();
        if (isInvalid) {
            const errorText = await invalidCredentialsMsg.innerText();
            throw new Error(`❌ AUTH FAILED: "${errorText}".`, { cause: error });
        }
        // Rethrow for other issues (timeout, navigation etc)
        throw error;
    }

    // 4. Persistence
    console.log('💾 Saving session state...');
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });
    console.log(`✅ Session Saved Successfully at: ${AUTH_FILE_PATH}`);
});