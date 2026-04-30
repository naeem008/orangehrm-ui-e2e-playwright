import { test, expect } from '@playwright/test';

import { createSelfClaim } from '../../../setups/claim.setup';
import { ClaimNavigationPage } from '../../../pages/claim/claim-navigation.page';

test.describe('Claim - End-to-End Submission & Grid Verification', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should verify total amount and find the record in My Claims grid', async ({ page }) => {
        const claimNavigation = new ClaimNavigationPage(page);

        const claimData = await createSelfClaim(page, {
            expenses: [
                { type: 'Breakfast', amount: '3000' },
                { type: 'Lunch', amount: '5000' },
                { type: 'Transport', amount: '6000' },
            ],
            submit: true,
            uploadReceipt: true,
            remarks: 'Automated claim submission by Playwright.',
        });

        await claimNavigation.navigateToMyClaims();

        const tableRow = await claimNavigation.expectClaimRowVisible(claimData.eventName);

        await expect(tableRow).toContainText(claimData.expectedTotal);
        await expect(tableRow).toContainText(/Initiated|Submitted/i);

        console.log(`[SUCCESS] Claim for ${claimData.eventName} verified in My Claims grid!`);
    });
});
