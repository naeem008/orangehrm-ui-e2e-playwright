import { Page, expect } from '@playwright/test';
import { NavbarPage } from '../pages/navbar.page';
import { EmployeeListPage } from '../pages/pim/employee-list.page';
import { EmployeeFormPage } from '../pages/pim/employee-form.page';

// Helper function to generate a random string for names
const getRandomName = (length: number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Capitalize the first letter
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export async function createEmployee(page: Page) {
    const navbar = new NavbarPage(page);
    const employeeList = new EmployeeListPage(page);
    const employeeForm = new EmployeeFormPage(page);

    // 1. Generate 100% random First and Last names
    const firstName = getRandomName(7);
    const lastName = getRandomName(8);
    const employeeId = Date.now().toString().slice(-6);

    // 2. Execute Flow
    await navbar.goToPIM();
    await employeeList.clickAddEmployee();

    // This method clicks 'Save' internally
    await employeeForm.fillEmployeeDetails(firstName, lastName, employeeId);

    // 🛡️ SENIOR FIX (RACE CONDITION PREVENTED):
    // Force Playwright to wait for the backend to finish saving and show the success toast
    await expect(page.locator('.oxd-toast-content--success')).toBeVisible({ timeout: 15000 });

    // 3. Validation (Now it's safe to check the URL because the server has redirected)
    await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 15000 });

    // 4. Return the random names so the 'Read' test can use them
    return { firstName, lastName, employeeId };
}
