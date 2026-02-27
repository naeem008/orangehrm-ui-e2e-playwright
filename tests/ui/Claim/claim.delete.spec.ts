import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { ClaimFormPage } from '../../../pages/claim/claim-form.page';

test.describe('Claim - Delete/Cancel Claim (Self)', () => {
    test('Should successfully cancel a submitted claim and verify status update', async ({ page }) => {
        const claimForm = new ClaimFormPage(page);
        const today = new Date().toISOString().split('T')[0];

        // 1. Navigation & Setup
        console.log(`[ACTION] Navigating to Dashboard...`);
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });

        const eventData = await createEventSetup(page);

        // 2. PRECONDITION: Create and completely Submit a claim
        console.log(`[SETUP] Creating a claim to cancel (soft delete)...`);
        await page.getByRole('link', { name: 'Claim', exact: true }).click();
        await page.getByRole('link', { name: 'Submit Claim' }).click();

        await claimForm.eventDropdown.click();
        await page.getByRole('option', { name: eventData.eventName }).click();
        await claimForm.currencyDropdown.click();
        await page.getByRole('option', { name: 'Bangladeshi Taka' }).click();
        await claimForm.createButton.click();

        await claimForm.addExpense('Transport', today, '1500');

        // Fully submitting the claim
        await claimForm.finalSubmitButton.click();
        await page.waitForSelector('.oxd-toast--success', { state: 'hidden' });

        // 3. Navigate to My Claims
        console.log(`[ACTION] Navigating to My Claims list...`);
        await page.getByRole('link', { name: 'My Claims' }).click();
        await page.waitForLoadState('domcontentloaded');

        // 4. LOCATE & VIEW DETAILS
        console.log(`[ACTION] Locating Event: ${eventData.eventName} and opening details...`);
        const targetRow = page.locator('.oxd-table-card').filter({ hasText: eventData.eventName });
        await targetRow.getByRole('button', { name: 'View Details' }).click();

        // 5. CANCEL OPERATION (Soft Delete)
        console.log(`[ACTION] Clicking Cancel button inside claim details...`);
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Wait for success toast after cancellation to disappear
        await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 10000 });
        await page.waitForSelector('.oxd-toast--success', { state: 'hidden' });

        // 🚀 6. NEW FIX: Click 'Back' button to return to the grid (As per manual flow)
        console.log(`[ACTION] Clicking 'Back' button to return to the grid...`);
        await page.getByRole('button', { name: 'Back' }).click();
        await page.waitForLoadState('domcontentloaded');

        // 7. FINAL VERIFICATION: Find the row again and check status
        console.log(`[VERIFY] Checking if the status updated to 'Cancelled' in the grid...`);
        const canceledRow = page.locator('.oxd-table-card').filter({ hasText: eventData.eventName });

        // Assert the row is there and the status text says 'Cancelled' exactly
        await expect(canceledRow).toBeVisible();
        await expect(canceledRow).toContainText('Cancelled');

        console.log(`[SUCCESS] Claim successfully canceled and verified as 'Cancelled'!`);
    });
});
