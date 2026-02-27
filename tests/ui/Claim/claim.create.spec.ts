import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { ClaimFormPage } from '../../../pages/claim/claim-form.page';

test.describe('Claim - End-to-End Submission & Grid Verification', () => {
    test('Should verify total amount and find the record in My Claims grid', async ({ page }) => {
        const claimForm = new ClaimFormPage(page);
        const today = new Date().toISOString().split('T')[0];

        // 1. Navigation
        console.log(`[ACTION] Navigating to Dashboard...`);
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });

        // 2. Setup Prerequisite Event
        const eventData = await createEventSetup(page);

        // 3. Start Claim Process
        console.log(`[ACTION] Starting Claim Submission...`);
        await page.getByRole('link', { name: 'Claim', exact: true }).click();
        await page.getByRole('link', { name: 'Submit Claim' }).click();

        await claimForm.eventDropdown.click();
        await page.getByRole('option', { name: eventData.eventName }).click();
        await claimForm.currencyDropdown.click();
        await page.getByRole('option', { name: 'Bangladeshi Taka' }).click();
        await claimForm.createButton.click();

        // 4. Add Multi-Expenses
        await claimForm.addExpense('Breakfast', today, '3000');
        await claimForm.addExpense('Lunch', today, '5000');
        await claimForm.addExpense('Transport', today, '6000');
        await claimForm.uploadAttachment('receipt.txt');

        // 5. STEP 1: Verify Total Amount
        await claimForm.verifyTotalAmount('14,000.00');

        // 6. STEP 2: Final Submit and Go Back (ROBUST FIX)
        await claimForm.finalSubmitButton.click();
        await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 10000 });
        await page.waitForSelector('.oxd-toast--success', { state: 'hidden' }); // Wait for toast to clear
        await claimForm.clickBack();

        // 7. STEP 3: Verify in "My Claims" Grid
        console.log(`[ACTION] Checking for Event: ${eventData.eventName} in the grid...`);
        await page.waitForLoadState('domcontentloaded');

        const tableRow = page.locator('.oxd-table-card').filter({ hasText: eventData.eventName });

        await expect(tableRow).toBeVisible();
        await expect(tableRow).toContainText('14,000.00');

        await expect(tableRow).toContainText(/Initiated|Submitted/);

        console.log(`[SUCCESS] Claim for ${eventData.eventName} verified in My Claims grid!`);
    });
});
