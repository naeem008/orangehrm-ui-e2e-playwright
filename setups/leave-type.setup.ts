import { expect, type Page } from '@playwright/test';

import { LeaveTypeListPage } from '../pages/leave/leave-type-list.page';
import { LeaveTypeFormPage } from '../pages/leave/leave-type-form.page';

export async function createLeaveType(page: Page) {
    const leaveTypeList = new LeaveTypeListPage(page);
    const leaveTypeForm = new LeaveTypeFormPage(page);

    await leaveTypeList.navigateToLeaveTypes();
    await leaveTypeList.clickAddLeaveType();

    const uniqueLeaveName = `SickLeave_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`;

    console.log(`[SETUP] Generating new Leave Type: ${uniqueLeaveName}`);

    await leaveTypeForm.fillLeaveTypeName(uniqueLeaveName);
    await leaveTypeForm.clickSave();

    await expect(page.getByText('Successfully Saved')).toBeVisible({
        timeout: 15000,
    });

    console.log(`[SETUP] Leave Type "${uniqueLeaveName}" created successfully.`);

    return {
        leaveName: uniqueLeaveName,
    };
}