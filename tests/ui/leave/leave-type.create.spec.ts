import { test, expect } from '@playwright/test';
import { createLeaveType } from '../../../setups/leave-type.setup';

test.describe('Leave - Leave Type Create', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully create a new Leave Type and verify it in the list', async ({ page }) => {
        const leaveData = await createLeaveType(page);

        console.log('------------------------------------------------');
        console.log(`[TEST] Verifying creation of: ${leaveData.leaveName}`);

        const createdRow = page.getByRole('row', { name: leaveData.leaveName });
        await expect(createdRow).toBeVisible();

        console.log(`[SUCCESS] Leave Type "${leaveData.leaveName}" is successfully displayed in the grid!`);
        console.log('------------------------------------------------');
    });
});
