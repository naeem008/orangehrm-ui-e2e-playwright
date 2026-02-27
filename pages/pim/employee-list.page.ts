import { Page, Locator } from '@playwright/test';

export class EmployeeListPage {
    readonly page: Page;
    readonly addEmployeeTab: Locator;

    readonly employeeIdInput: Locator;

    // Locators for search functionality
    readonly employeeNameInput: Locator;
    readonly searchBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addEmployeeTab = page.getByRole('link', { name: 'Add Employee' });
        this.employeeIdInput = page
            .locator('div')
            .filter({ hasText: /^Employee Id$/ })
            .locator('input');
        // Locator for the Employee Name search box
        this.employeeNameInput = page.getByPlaceholder('Type for hints...').first();

        // Locator for the Search button
        this.searchBtn = page.getByRole('button', { name: 'Search' });
    }

    async clickAddEmployee() {
        await this.addEmployeeTab.click();
    }

    // This is the method that was missing and causing the red mark
    async searchEmployee(name: string) {
        // Fill the name and click search
        await this.employeeNameInput.fill(name);
        await this.searchBtn.click();

        // Adding a small wait for the table to refresh with results
        await this.page.waitForTimeout(2000);
    }

    // Method to search by Employee Id
    async searchByEmployeeId(id: string) {
        await this.employeeIdInput.fill(id);
        await this.searchBtn.click();
        await this.page.waitForTimeout(2000); // Wait for the table to load
    }
    // Method to click the delete icon and confirm deletion
    async deleteEmployeeFromGrid() {
        // Click the trash icon in the filtered result
        await this.page.locator('.bi-trash').first().click();

        // Wait for the confirmation modal and click 'Yes, Delete'
        const confirmDeleteBtn = this.page.getByRole('button', { name: 'Yes, Delete' });
        await confirmDeleteBtn.click();
    }
}
