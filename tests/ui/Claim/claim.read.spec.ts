import { test, expect } from '@playwright/test';

import { createSelfClaim } from '../../../setups/claim.setup';
import { ClaimNavigationPage } from '../../../pages/claim/claim-navigation.page';

test.describe('Claim - Read Claim (Self)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully navigate to My Claims and read claim details', async ({ page }) => {
        const claimNavigation = new ClaimNavigationPage(page);

        const claimData = await createSelfClaim(page, {
            expenses: [{ type: 'Lunch', amount: '5000' }],
            submit: true,
            remarks: 'Automated claim for read verification.',
        });

        await claimNavigation.navigateToMyClaims();

        const targetRow = await claimNavigation.expectClaimRowVisible(claimData.eventName);

        await expect(targetRow).toContainText(claimData.expectedTotal);

        const viewDetailsButton = targetRow.getByRole('button', { name: 'View Details' });
        await expect(viewDetailsButton).toBeVisible({ timeout: 15000 });
        await viewDetailsButton.click();

        await expect(page.locator('p.oxd-text', { hasText: /Total Amount/ })).toContainText(claimData.expectedTotal, {
            timeout: 30000,
        });

        console.log(`[SUCCESS] Claim read operation verified for ${claimData.eventName}.`);
    });
});
