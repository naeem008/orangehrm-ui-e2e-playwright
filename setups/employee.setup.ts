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
    const firstName = getRandomName(7); // Generates a random 7-letter name
    const lastName = getRandomName(8);  // Generates a random 8-letter name
    const employeeId = Date.now().toString().slice(-6);

    // 2. Execute Flow
    await navbar.goToPIM();
    await employeeList.clickAddEmployee();
    await employeeForm.fillEmployeeDetails(firstName, lastName, employeeId);

    // 3. Validation
    await expect(page).toHaveURL(/viewPersonalDetails/);

    // 4. Return the random names so the 'Read' test can use them
    return { firstName, lastName, employeeId };
}