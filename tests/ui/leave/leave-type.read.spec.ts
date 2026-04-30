import { test, expect } from '@playwright/test';

import { LeaveTypeListPage } from '../../../pages/leave/leave-type-list.page';

test.describe('Leave - Leave Type Read', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/dashboard/index', {
            waitUntil: 'domcontentloaded',
        });

        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({
            timeout: 15000,
        });
    });

    test('Should successfully navigate to Leave Type list and verify table structure', async ({ page }) => {
        const leaveTypeList = new LeaveTypeListPage(page);

        console.log('------------------------------------------------');
        console.log('[ACTION] Navigating to Leave Types Page to Read data...');

        await leaveTypeList.navigateToLeaveTypes();

        await expect(page).toHaveURL(/.*leave.*leaveTypeList.*/);

        await expect(leaveTypeList.pageHeading).toBeVisible();
        await expect(leaveTypeList.tableHeader).toBeVisible();

        await expect(leaveTypeList.tableHeader.getByText(/^Name$/i)).toBeVisible();
        await expect(leaveTypeList.tableHeader.getByText(/^Actions$/i)).toBeVisible();

        console.log('[SUCCESS] Leave Type list page is fully loaded and readable!');
        console.log('------------------------------------------------');
    });
});
