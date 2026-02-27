import { test, expect } from '@playwright/test';
import { createLeaveType } from '../../../setups/leave-type.setup';
import { LeaveTypeListPage } from '../../../pages/leave/leave-type-list.page';

test.describe('Leave - Leave Type Delete', () => {
    test.beforeEach(async ({ page }) => {
        // Ensuring we start from a clean state on the dashboard
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully delete an existing Leave Type', async ({ page }) => {
        const leaveTypeList = new LeaveTypeListPage(page);

        // 1. SETUP: Create a fresh Leave Type to delete
        const leaveData = await createLeaveType(page);

        console.log('------------------------------------------------');
        console.log(`[SETUP] Created Leave Type for Deletion: ${leaveData.leaveName}`);

        // Navigate to the list page
        await page.goto(`${process.env.BASE_URL}/web/index.php/leave/leaveTypeList`);

        // 2. ACTION: Find the specific row and click the Delete (Trash) icon
        await leaveTypeList.clickDeleteForLeaveType(leaveData.leaveName);

        // 3. ACTION: Confirm deletion in the modal
        await leaveTypeList.confirmDelete();

        // 4. VERIFY: Check for the success toast message
        await expect(page.getByText('Successfully Deleted')).toBeVisible();

        // 5. VERIFY: Ensure the row is permanently removed from the table (Dynamic Assertion)
        const deletedRow = page.getByRole('row', { name: leaveData.leaveName });
        await expect(deletedRow).not.toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Leave Type "${leaveData.leaveName}" has been deleted.`);
        console.log('------------------------------------------------');
    });
});
