import { Page, expect } from '@playwright/test';
import { NavbarPage } from '../pages/navbar.page';
import { LeaveTypeListPage } from '../pages/leave/leave-type-list.page';
import { LeaveTypeFormPage } from '../pages/leave/leave-type-form.page';

// This setup function creates a new Leave Type and returns the generated data
export async function createLeaveType(page: Page) {
    const navbar = new NavbarPage(page);
    const leaveTypeList = new LeaveTypeListPage(page);
    const leaveTypeForm = new LeaveTypeFormPage(page);

    // 1. Navigate to the Leave module from the top/side navbar
    await navbar.goToLeave();

    // 2. Open Configure -> Leave Types dropdown
    await leaveTypeList.navigateToLeaveTypes();

    // 3. Click the '+ Add' button
    await leaveTypeList.clickAddLeaveType();

    // 4. Generate a unique Leave Type name using a timestamp to avoid duplicates
    // Example output: "SickLeave_83492"
    const uniqueLeaveName = 'SickLeave_' + Date.now().toString().slice(-5);
    console.log(`[SETUP] Generating new Leave Type: ${uniqueLeaveName}`);

    // 5. Fill out the form and click Save
    await leaveTypeForm.fillLeaveTypeName(uniqueLeaveName);
    await leaveTypeForm.clickSave();

    // 6. Wait for the success toast message to guarantee the data is saved in the DB
    await expect(page.getByText('Successfully Saved')).toBeVisible();
    console.log(`[SETUP] Leave Type "${uniqueLeaveName}" created successfully.`);

    // Return the generated name so our tests can use it for Search, Update, or Delete
    return {
        leaveName: uniqueLeaveName,
    };
}
