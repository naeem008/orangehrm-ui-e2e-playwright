import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE_PATH = path.join('playwright', '.auth', 'admin.json');

// Pre-validating environment variables to avoid conditionals inside the test block
const username = process.env.ADMIN_USERNAME || '';
const password = process.env.ADMIN_PASSWORD || '';
const rawBaseUrl = process.env.BASE_URL || '';

test('setup: create admin storageState', async ({ page }) => {
    // 1. Strict Environment Validation
    expect(username, 'ADMIN_USERNAME must be defined').not.toBe('');
    expect(password, 'ADMIN_PASSWORD must be defined').not.toBe('');
    expect(rawBaseUrl, 'BASE_URL must be defined').not.toBe('');

    const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');

    // 2. URL Discovery Logic: Handles both local subfolder and CI root paths
    let loginUrl = `${cleanBaseUrl}/web/index.php/auth/login`;
    console.log(`Navigation attempt: ${loginUrl}`);

    let response = await page.goto(loginUrl, { timeout: 60000 });

    // Handle 404 by retrying at the root level (Common in CI Docker environments)
    if (response?.status() === 404) {
        const rootUrl = new URL(cleanBaseUrl).origin;
        loginUrl = `${rootUrl}/web/index.php/auth/login`;
        console.log(`404 encountered. Retrying at: ${loginUrl}`);
        response = await page.goto(loginUrl, { timeout: 60000 });
    }

    // Ensure the page loaded successfully (200 OK)
    expect(response?.ok(), `Failed to load login page. Status: ${response?.status()}`).toBeTruthy();

    // 3. Login Form Interaction
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    await usernameField.waitFor({ state: 'visible', timeout: 30000 });

    await usernameField.fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Smart Authentication Validation
    const invalidCredentialsMsg = page.locator('.oxd-alert-content-text');

    try {
        // Wait for dashboard redirection
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    } catch (error: unknown) {
        // Check if explicit "Invalid credentials" error is shown on UI
        if (await invalidCredentialsMsg.isVisible()) {
            const errorText = await invalidCredentialsMsg.innerText();
            throw new Error(`Authentication Failed: ${errorText}`, { cause: error });
        }
        throw error;
    }

    // 5. Session Persistence
    await fs.promises.mkdir(path.dirname(AUTH_FILE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_FILE_PATH });
    console.log('Session saved successfully.');
});
