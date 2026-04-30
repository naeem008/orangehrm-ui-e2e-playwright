import { type Page } from '@playwright/test';

import { LeaveTypeFormPage } from '../pages/leave/leave-type-form.page';
import { LeaveTypeListPage } from '../pages/leave/leave-type-list.page';

function generateUniqueLeaveName(): string {
    return `SickLeave_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createLeaveType(page: Page) {
    const leaveTypeList = new LeaveTypeListPage(page);
    const leaveTypeForm = new LeaveTypeFormPage(page);

    const uniqueLeaveName = generateUniqueLeaveName();

    console.log(`[SETUP] Creating Leave Type: ${uniqueLeaveName}`);

    await leaveTypeList.navigateToLeaveTypes();
    await leaveTypeList.clickAddLeaveType();

    await leaveTypeForm.fillLeaveTypeName(uniqueLeaveName);
    await leaveTypeForm.clickSave();

    await page.getByText('Successfully Saved').waitFor({
        state: 'visible',
        timeout: 15000,
    });

    await page
        .getByText('Successfully Saved')
        .waitFor({
            state: 'hidden',
            timeout: 30000,
        })
        .catch(() => {
            console.log('[INFO] Success toast did not hide within timeout, continuing.');
        });

    await leaveTypeList.navigateToLeaveTypes();

    const createdRow = page.locator('.oxd-table-card').filter({
        hasText: uniqueLeaveName,
    });

    await createdRow.waitFor({
        state: 'visible',
        timeout: 30000,
    });

    console.log(`[SETUP] Leave Type Created and Verified: ${uniqueLeaveName}`);

    return {
        leaveName: uniqueLeaveName,
    };
}
