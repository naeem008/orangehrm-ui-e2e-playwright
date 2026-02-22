import { Page, Locator } from '@playwright/test';

export class LeaveTypeListPage {
    readonly page: Page;
    readonly configureMenu: Locator;
    readonly leaveTypesOption: Locator;
    readonly addBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.configureMenu = page.getByText('Configure');
        this.leaveTypesOption = page.getByRole('menuitem', { name: 'Leave Types' });
        this.addBtn = page.getByRole('button', { name: 'Add' });
    }

    // Method to navigate to the Leave Types table
    async navigateToLeaveTypes() {
        await this.configureMenu.click();
        await this.leaveTypesOption.click();
        // Playwright will automatically wait for the next element, so we removed waitForURL
    }

    // Method to click the Add button
    async clickAddLeaveType() {
        await this.addBtn.click();
        // Removed waitForURL from here as well
    }
}