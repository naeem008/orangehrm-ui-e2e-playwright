import { test, expect } from '@playwright/test';
import { LeaveTypeListPage } from '../../../pages/leave/leave-type-list.page';

test.describe('Leave - Leave Type Read', () => {
    test.beforeEach(async ({ page }) => {
        // Start from the dashboard to ensure a clean state
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully navigate to Leave Type list and verify table structure', async ({ page }) => {
        const leaveTypeList = new LeaveTypeListPage(page);

        console.log('------------------------------------------------');
        console.log(`[ACTION] Navigating to Leave Types Page to Read data...`);

        // 1. ACTION: Navigate to the Leave Types page via the menu
        await leaveTypeList.navigateToLeaveTypes();

        // 2. VERIFY: Assert the page header is visible (Reading the page title)
        const pageHeader = page.getByRole('heading', { name: 'Leave Types' });
        await expect(pageHeader).toBeVisible();

        // 3. VERIFY: Assert the table columns loaded correctly (Reading the structure)
        const nameColumnHeader = page.getByRole('columnheader', { name: 'Name' });
        const actionsColumnHeader = page.getByRole('columnheader', { name: 'Actions' });

        await expect(nameColumnHeader).toBeVisible();
        await expect(actionsColumnHeader).toBeVisible();

        console.log(`[SUCCESS] Leave Type list page is fully loaded and readable!`);
        console.log('------------------------------------------------');
    });
});
