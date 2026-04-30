import { test, expect } from '@playwright/test';

import { createSelfClaim } from '../../../setups/claim.setup';
import { ClaimFormPage } from '../../../pages/claim/claim-form.page';

test.describe('Claim - Update Claim (Self)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully update an expense amount in a draft claim', async ({ page }) => {
        const claimForm = new ClaimFormPage(page);

        const claimData = await createSelfClaim(page, {
            expenses: [{ type: 'Transport', amount: '1000' }],
            submit: false,
            remarks: 'Automated draft claim for update verification.',
        });

        await claimForm.verifyTotalAmount('1,000.00');

        const expenseRow = page.locator('.oxd-table-card').filter({
            hasText: 'Transport',
        });

        await expect(expenseRow).toBeVisible({ timeout: 30000 });

        const editButton = expenseRow.locator('.bi-pencil-fill');
        await expect(editButton).toBeVisible({ timeout: 15000 });
        await editButton.click();

        const dialog = page.locator('.oxd-dialog-container-default');
        await expect(dialog).toBeVisible({ timeout: 30000 });

        const amountInput = dialog.locator('div.oxd-grid-2 input').nth(1);
        await expect(amountInput).toBeVisible({ timeout: 15000 });
        await amountInput.fill('2500');

        const saveButton = dialog.getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 15000 });
        await saveButton.click();

        await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });
        await expect(dialog).toBeHidden({ timeout: 30000 });

        await claimForm.verifyTotalAmount('2,500.00');

        console.log(`[SUCCESS] Draft claim expense updated for ${claimData.eventName}.`);
    });
});
