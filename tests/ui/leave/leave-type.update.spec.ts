import { test, expect } from '@playwright/test';
import { createLeaveType } from '../../../setups/leave-type.setup';
import { LeaveTypeListPage } from '../../../pages/leave/leave-type-list.page';
import { LeaveTypeFormPage } from '../../../pages/Leave/leave-type-form.page';

test.describe('Leave - Leave Type Update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully edit an existing Leave Type', async ({ page }) => {
        const leaveTypeList = new LeaveTypeListPage(page);
        const leaveTypeForm = new LeaveTypeFormPage(page);

        // 1. SETUP: Create Leave
        const leaveData = await createLeaveType(page);

        // Extract ID and make the new name "Earn leave"
        const uniqueId = leaveData.leaveName.split('_')[1] || Date.now().toString().slice(-4);
        const updatedLeaveName = `Earn leave_${uniqueId}`;

        console.log('------------------------------------------------');
        console.log(`[PRINT] Created Leave Name: ${leaveData.leaveName}`);
        console.log(`[PRINT] Update to Leave Name: ${updatedLeaveName}`);

        await page.goto(`${process.env.BASE_URL}/web/index.php/leave/leaveTypeList`);

        // 2. ACTION: Click Edit for the specific row
        await leaveTypeList.clickEditForLeaveType(leaveData.leaveName);

        // 🔥 CAPSTONE PERFECT FIX: Using purely Dynamic Waits instead of waitForTimeout
        const nameInput = page.locator('form').getByRole('textbox').first();

        // Wait dynamically for backend to load the old name
        await expect(nameInput).toHaveValue(leaveData.leaveName, { timeout: 10000 });

        // Clear the field and dynamically wait for it to be completely empty
        await nameInput.clear();
        await expect(nameInput).toBeEmpty();

        // Fill the new name and dynamically wait for the UI to register the text
        await nameInput.fill(updatedLeaveName);
        await expect(nameInput).toHaveValue(updatedLeaveName);

        // Now it is 100% safe to click save
        await leaveTypeForm.clickSave();

        // 3. VERIFY: Check if the success toast appears
        await expect(page.getByText('Successfully Updated')).toBeVisible();

        // 4. VERIFY: Check if the new "Earn leave" is visible in the table
        const updatedRow = page.getByRole('row', { name: updatedLeaveName });
        await expect(updatedRow).toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Verified new name in table: ${updatedLeaveName}`);
        console.log('------------------------------------------------');
    });
});
