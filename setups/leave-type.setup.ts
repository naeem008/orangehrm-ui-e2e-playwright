import { expect, type Page } from '@playwright/test';

import { LeaveTypeFormPage } from '../pages/leave/leave-type-form.page';
import { LeaveTypeListPage } from '../pages/leave/leave-type-list.page';

export async function createLeaveType(page: Page) {
    const leaveTypeList = new LeaveTypeListPage(page);
    const leaveTypeForm = new LeaveTypeFormPage(page);

    const uniqueLeaveName = `SickLeave_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    console.log(`[SETUP] Creating Leave Type: ${uniqueLeaveName}`);

    await leaveTypeList.navigateToLeaveTypes();
    await leaveTypeList.clickAddLeaveType();

    await leaveTypeForm.fillLeaveTypeName(uniqueLeaveName);
    await leaveTypeForm.clickSave();

    await expect(page.getByText('Successfully Saved')).toBeVisible({
        timeout: 15000,
    });

    await expect(page.getByText('Successfully Saved'))
        .toBeHidden({
            timeout: 30000,
        })
        .catch(() => {});

    await leaveTypeList.navigateToLeaveTypes();

    const createdRow = page.locator('.oxd-table-card').filter({
        hasText: uniqueLeaveName,
    });

    await expect(createdRow).toBeVisible({ timeout: 30000 });

    console.log(`[SETUP] Leave Type Created: ${uniqueLeaveName}`);

    return {
        leaveName: uniqueLeaveName,
    };
}
