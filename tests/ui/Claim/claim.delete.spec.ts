import { test, expect } from '@playwright/test';

import { createSelfClaim } from '../../../setups/claim.setup';
import { ClaimNavigationPage } from '../../../pages/claim/claim-navigation.page';

test.describe('Claim - Delete/Cancel Claim (Self)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully cancel a submitted claim and verify status update', async ({ page }) => {
        const claimNavigation = new ClaimNavigationPage(page);

        const claimData = await createSelfClaim(page, {
            expenses: [{ type: 'Transport', amount: '1500' }],
            submit: true,
            remarks: 'Automated claim for cancel verification.',
        });

        await claimNavigation.navigateToMyClaims();

        const targetRow = await claimNavigation.expectClaimRowVisible(claimData.eventName);

        const viewDetailsButton = targetRow.getByRole('button', { name: 'View Details' });
        await expect(viewDetailsButton).toBeVisible({ timeout: 15000 });
        await viewDetailsButton.click();

        const cancelButton = page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 15000 });
        await cancelButton.click();

        await expect(page.locator('.oxd-toast--success')).toBeVisible({ timeout: 15000 });

        await page
            .locator('.oxd-toast--success')
            .waitFor({
                state: 'hidden',
                timeout: 30000,
            })
            .catch(() => {
                console.log('[INFO] Cancel toast did not hide within timeout, continuing.');
            });

        const backButton = page.getByRole('button', { name: 'Back' });
        await expect(backButton).toBeVisible({ timeout: 15000 });
        await backButton.click();

        const canceledRow = await claimNavigation.expectClaimRowVisible(claimData.eventName);

        await expect(canceledRow).toContainText('Cancelled');

        console.log(`[SUCCESS] Claim ${claimData.eventName} cancelled and verified.`);
    });
});
