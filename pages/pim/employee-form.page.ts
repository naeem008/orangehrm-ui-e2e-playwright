import { Page, Locator } from '@playwright/test';

export class EmployeeFormPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });

        this.employeeIdInput = page
            .locator('div')
            .filter({ hasText: /^Employee Id$/ })
            .getByRole('textbox');

        this.saveBtn = page.getByRole('button', { name: 'Save' });
    }

    async fillEmployeeDetails(firstName: string, lastName: string, empId: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.employeeIdInput.fill(empId);
        await this.saveBtn.click();
    }
}
