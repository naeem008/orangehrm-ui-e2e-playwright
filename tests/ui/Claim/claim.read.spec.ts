import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { ClaimFormPage } from '../../../pages/claim/claim-form.page';

test.describe('Claim - Read Claim (Self)', () => {
    test('Should successfully navigate to My Claims and read claim details', async ({ page }) => {
        const claimForm = new ClaimFormPage(page);
        const today = new Date().toISOString().split('T')[0];

        // 1. Navigation & Independent Test Data Setup
        console.log(`[ACTION] Navigating to Dashboard...`);
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });

        const eventData = await createEventSetup(page);

        // 2. PRECONDITION: Create a claim to Read
        console.log(`[SETUP] Submitting a claim to test Read functionality...`);
        await page.getByRole('link', { name: 'Claim', exact: true }).click();
        await page.getByRole('link', { name: 'Submit Claim' }).click();

        await claimForm.eventDropdown.click();
        await page.getByRole('option', { name: eventData.eventName }).click();
        await claimForm.currencyDropdown.click();
        await page.getByRole('option', { name: 'Bangladeshi Taka' }).click();
        await claimForm.createButton.click();

        await claimForm.addExpense('Lunch', today, '5000');
        await claimForm.finalSubmitButton.click();
        await page.waitForSelector('.oxd-toast--success', { state: 'hidden' });

        // 3. ACTION: Navigate to "My Claims" to READ the data
        console.log(`[ACTION] Navigating to My Claims list...`);
        await page.getByRole('link', { name: 'My Claims' }).click();
        await page.waitForLoadState('domcontentloaded');

        // 4. VERIFICATION: Find the specific row in the grid
        console.log(`[VERIFY] Finding Event: ${eventData.eventName} in the Grid...`);
        const targetRow = page.locator('.oxd-table-card').filter({ hasText: eventData.eventName });

        await expect(targetRow).toBeVisible();
        await expect(targetRow).toContainText('5,000.00');

        // 5. ACTION: Click "View Details" to fully read the claim
        console.log(`[ACTION] Clicking 'View Details' button...`);
        await targetRow.getByRole('button', { name: 'View Details' }).click();

        // 6. FINAL VERIFICATION: Assert we are on the View/Read page
        // "Total Amount" text proves we are reading the details correctly
        await expect(page.locator('p.oxd-text', { hasText: /Total Amount/ })).toContainText('5,000.00');
        console.log(`[SUCCESS] Claim read operation verified successfully!`);
    });
});
