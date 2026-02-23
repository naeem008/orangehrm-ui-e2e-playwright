import { test, expect } from '@playwright/test';
import { createLeaveType } from '../../../setups/leave-type.setup';
import { LeaveTypeListPage } from '../../../pages/leave/leave-type-list.page';
import { LeaveTypeFormPage } from '../../../pages/leave/leave-type-form.page';

test.describe('Leave - Leave Type Update', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully edit an existing Leave Type', async ({ page }) => {
        const leaveTypeList = new LeaveTypeListPage(page);
        const leaveTypeForm = new LeaveTypeFormPage(page);

        // 1. SETUP: Create a fresh Leave Type to edit (Ensures test is atomic)
        const leaveData = await createLeaveType(page);
        const updatedLeaveName = leaveData.leaveName + '_Updated';

        console.log('------------------------------------------------');
        console.log(`[TEST] Editing Leave Type: ${leaveData.leaveName}`);

        // 2. ACTION: Find the specific row and click Edit
        await leaveTypeList.clickEditForLeaveType(leaveData.leaveName);

        // 3. ACTION: Clear old name, type new name, and Save
        await leaveTypeForm.leaveTypeNameInput.clear();
        await leaveTypeForm.fillLeaveTypeName(updatedLeaveName);
        await leaveTypeForm.clickSave();

        // 4. VERIFY: Check if the success toast appears
        await expect(page.getByText('Successfully Updated')).toBeVisible();

        // 5. VERIFY: Check if the new updated name is visible in the table
        const updatedRow = page.getByRole('row', { name: updatedLeaveName });
        await expect(updatedRow).toBeVisible();

        console.log(`[SUCCESS] Leave Type successfully renamed to: ${updatedLeaveName}`);
        console.log('------------------------------------------------');
    });

});