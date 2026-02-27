import { test, expect } from '@playwright/test';
import { createEmployee } from '../../../setups/employee.setup';
import { EmployeeListPage } from '../../../pages/pim/employee-list.page';

test.describe('PIM - Employee Delete', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully delete an employee and verify removal using Employee ID', async ({ page }) => {
        // 1. CREATE: Generate the employee first (Atomic approach)
        const employeeData = await createEmployee(page);
        console.log('------------------------------------------------');
        console.log(`[SETUP] Created Employee to Delete`);
        console.log(`[INFO] Employee ID: ${employeeData.employeeId}`);
        console.log('------------------------------------------------');

        // 2. NAVIGATE & SEARCH
        await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, {
            waitUntil: 'domcontentloaded',
        });
        const employeeList = new EmployeeListPage(page);

        console.log(`[ACTION] Searching for ID: ${employeeData.employeeId} to perform deletion...`);
        await employeeList.searchByEmployeeId(employeeData.employeeId);

        // Wait to ensure the record is visible in the grid before deleting
        await expect(page.locator('.oxd-table-card').first()).toBeVisible();

        // 3. DELETE: Click the trash icon and confirm
        console.log(`[ACTION] Deleting the employee record...`);
        await employeeList.deleteEmployeeFromGrid();

        // Verify the success toast message appears
        await expect(page.getByText('Successfully Deleted')).toBeVisible();
        console.log(`[SUCCESS] Toast message "Successfully Deleted" verified.`);

        // 4. VERIFY (Double Validation - Senior Level Practice)
        console.log(
            `[VERIFICATION] Re-searching ID: ${employeeData.employeeId} to ensure it is wiped from the database.`
        );

        // Navigating again to ensure a fresh UI state without cache
        await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, {
            waitUntil: 'domcontentloaded',
        });
        await employeeList.searchByEmployeeId(employeeData.employeeId);

        // Verify "No Records Found" message is visible
        const noRecordsMessage = page.getByText('No Records Found');
        await expect(noRecordsMessage).toBeVisible();

        console.log(`[RESULT] Employee perfectly deleted! "No Records Found" verified.`);
        console.log('------------------------------------------------');
    });
});
