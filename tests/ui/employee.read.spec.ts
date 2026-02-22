import { test, expect } from '@playwright/test';
import { createEmployee } from '../../setups/employee.setup';
import { EmployeeListPage } from '../../pages/pim/employee-list.page';

test.describe('PIM - Employee Read (Search)', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to Dashboard before each test using absolute URL for stability
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully search and find a newly created employee', async ({ page }) => {
        // 1. CREATE: Execute the setup function to create a random employee
        const employeeData = await createEmployee(page); //

        // ------------------------------------------------------------
        // PRINTING TO CONSOLE: This shows the random name in your terminal
        // ------------------------------------------------------------
        console.log('------------------------------------------------');
        console.log(`>>> TEST DATA GENERATED:`);
        console.log(`>>> First Name: ${employeeData.firstName}`); //
        console.log(`>>> Last Name:  ${employeeData.lastName}`);
        console.log(`>>> Employee ID: ${employeeData.employeeId}`);
        console.log('------------------------------------------------');

        // 2. NAVIGATE: Go to the Employee List page
        await page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`, { waitUntil: 'domcontentloaded' });

        // 3. READ/SEARCH: Use the Page Object to perform search
        const employeeList = new EmployeeListPage(page);

        console.log(`>>> ACTION: Searching for employee with name: ${employeeData.firstName}`);
        await employeeList.searchEmployee(employeeData.firstName); //

        // 4. ASSERT: Verify the result is visible in the table
        const searchResult = page.getByRole('cell', { name: employeeData.firstName }).first();
        await expect(searchResult).toBeVisible();

        console.log(`>>> SUCCESS: Employee "${employeeData.firstName}" found in the list!`);
        console.log('------------------------------------------------');
    });

});