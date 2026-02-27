import { test, expect } from '@playwright/test';
import { createEmployee } from '../../../setups/employee.setup';

test.describe('PIM - Employee Management CRUD', () => {
    // Hook to run before each test in this block
    test.beforeEach(async ({ page }) => {
        // 1. Navigate to the dashboard before executing the test flow
        // This uses the BASE_URL from the playwright.config.ts
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully create a new employee', async ({ page }) => {
        // 2. Execute the business flow from the setup file (POM)
        const employeeData = await createEmployee(page);

        // Log the generated unique data for debugging purposes
        console.log(
            `Created Employee: ${employeeData.firstName} ${employeeData.lastName} (ID: ${employeeData.employeeId})`
        );

        // 3. Assertions to validate successful creation
        await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue(employeeData.firstName);
        await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue(employeeData.lastName);
    });
});
