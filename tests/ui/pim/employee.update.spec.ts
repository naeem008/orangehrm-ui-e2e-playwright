import { test, expect } from '@playwright/test';
import { createEmployee } from '../../../setups/employee.setup';
import { EmployeeListPage } from '../../../pages/pim/employee-list.page';

test.describe('PIM - Employee Update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully update Last Name and verify from the grid using Employee ID', async ({ page }) => {
        // Step 1: Create employee with first name and last name
        const employeeData = await createEmployee(page);

        // Step 2: Print first name and last name
        console.log('------------------------------------------------');
        console.log(`[STEP 1 & 2] Employee Created Successfully`);
        console.log(`[INFO] Employee ID:  ${employeeData.employeeId}`);
        console.log(`[INFO] First Name:   ${employeeData.firstName}`);
        console.log(`[INFO] Last Name:    ${employeeData.lastName}`);
        console.log('------------------------------------------------');

        // Step 3: Search the employee with the id number
        await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, {
            waitUntil: 'domcontentloaded',
        });
        const employeeList = new EmployeeListPage(page);
        await employeeList.searchByEmployeeId(employeeData.employeeId);

        // Click the Edit (Pencil) icon
        await page.locator('.bi-pencil-fill').first().click();
        await page.waitForURL(/viewPersonalDetails/);

        // Step 4: Edit the last name and print the update last name
        const updatedLastName = 'Updated' + Date.now().toString().slice(-4);

        console.log(`[STEP 4] Updating Last Name`);
        console.log(`[INFO] New Last Name will be: ${updatedLastName}`);

        const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        await lastNameInput.click();
        await lastNameInput.fill(updatedLastName);

        // Save the update
        await page.locator('button[type="submit"]').first().click();
        await expect(page.getByText('Successfully Updated')).toBeVisible();

        // Step 5: Match the update last name by finding the employee by ID again
        await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, {
            waitUntil: 'domcontentloaded',
        });
        await employeeList.searchByEmployeeId(employeeData.employeeId);

        // Extract Last Name from the grid (Row)
        const resultRow = page.locator('.oxd-table-card').first();
        await expect(resultRow).toBeVisible();
        const actualLastNameInGrid = resultRow.locator('div[role="cell"]').nth(3);

        console.log('------------------------------------------------');
        console.log(`[STEP 5] Matching Updated Data from Grid`);
        console.log(`[EXPECTED] Last Name: ${updatedLastName}`);
        console.log(`[ACTUAL]   Last Name: ${actualLastNameInGrid}`);

        // The exact match assertion
        await expect(actualLastNameInGrid).toHaveText(updatedLastName);

        console.log(`[RESULT] Match Successful! The Last Name was updated correctly.`);
        console.log('------------------------------------------------');
    });
});
