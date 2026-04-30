import { expect, type Locator, type Page } from '@playwright/test';

export class LeaveTypeListPage {
    readonly page: Page;
    readonly leaveMenu: Locator;
    readonly configureMenu: Locator;
    readonly leaveTypesOption: Locator;
    readonly pageHeading: Locator;
    readonly tableHeader: Locator;
    readonly addBtn: Locator;
    readonly confirmDeleteBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.leaveMenu = page.getByRole('link', { name: 'Leave' });
        this.configureMenu = page.getByText('Configure');
        this.leaveTypesOption = page.getByRole('menuitem', { name: 'Leave Types' });

        this.pageHeading = page.getByRole('heading', { name: /^Leave Types$/i });
        this.tableHeader = page.locator('.oxd-table-header');

        this.addBtn = page.getByRole('button', { name: 'Add' });
        this.confirmDeleteBtn = page.getByRole('button', { name: 'Yes, Delete' });
    }

    async navigateToLeaveTypes() {
        // Ensure Leave module is opened first
        await this.leaveMenu.click();

        // Open Configure dropdown
        await expect(this.configureMenu).toBeVisible({ timeout: 15000 });
        await this.configureMenu.click();

        // Click Leave Types and wait for route change together
        await expect(this.leaveTypesOption).toBeVisible({ timeout: 15000 });

        await Promise.all([
            this.page.waitForURL(/.*leave.*leaveTypeList.*/, { timeout: 30000 }),
            this.leaveTypesOption.click(),
        ]);

        // Wait for actual page content, not only URL
        await expect(this.pageHeading).toBeVisible({ timeout: 30000 });
        await expect(this.addBtn).toBeVisible({ timeout: 30000 });
        await expect(this.tableHeader).toBeVisible({ timeout: 30000 });
    }

    async clickAddLeaveType() {
        await expect(this.addBtn).toBeVisible({ timeout: 15000 });
        await this.addBtn.click();
    }

    async clickEditForLeaveType(leaveName: string) {
        const targetRow = this.page.getByRole('row', { name: leaveName });
        await expect(targetRow).toBeVisible({ timeout: 15000 });
        await targetRow.locator('button').nth(1).click();
    }

    async clickDeleteForLeaveType(leaveName: string) {
        const targetRow = this.page.getByRole('row', { name: leaveName });
        await expect(targetRow).toBeVisible({ timeout: 15000 });
        await targetRow.locator('button').nth(0).click();
    }

    async confirmDelete() {
        await expect(this.confirmDeleteBtn).toBeVisible({ timeout: 15000 });
        await this.confirmDeleteBtn.click();
    }
}
