import { test, expect } from '@playwright/test';

import { createSelfClaim } from '../../../setups/claim.setup';
import { ClaimFormPage } from '../../../pages/claim/claim-form.page';

test.describe('Claim - Update Claim (Self)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully update a draft claim by adding another expense', async ({ page }) => {
        const claimForm = new ClaimFormPage(page);

        const claimData = await createSelfClaim(page, {
            expenses: [{ type: 'Transport', amount: '1000' }],
            submit: false,
            remarks: 'Automated draft claim for update verification.',
        });

        await claimForm.verifyTotalAmount('1,000.00');

        await claimForm.addExpense('Lunch', claimData.today, '1500');

        await claimForm.verifyTotalAmount('2,500.00');

        await expect(page.locator('.orangehrm-background-container')).toContainText('2,500.00', {
            timeout: 30000,
        });

        console.log(`[SUCCESS] Draft claim updated by adding expense for ${claimData.eventName}.`);
    });
});
