import { Page, Locator } from '@playwright/test';

export class LeaveTypeListPage {
    readonly page: Page;
    readonly configureMenu: Locator;
    readonly leaveTypesOption: Locator;
    readonly addBtn: Locator;
    readonly confirmDeleteBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.configureMenu = page.getByText('Configure');
        this.leaveTypesOption = page.getByRole('menuitem', { name: 'Leave Types' });
        this.addBtn = page.getByRole('button', { name: 'Add' });
        
        // Cleaned up the 'Yes, Delete' button from your codegen
        this.confirmDeleteBtn = page.getByRole('button', { name: 'Yes, Delete' });
    }

    async navigateToLeaveTypes() {
        await this.configureMenu.click();
        await this.leaveTypesOption.click();
    }

    async clickAddLeaveType() {
        await this.addBtn.click();
    }

    // 🔥 SENIOR LEVEL LOGIC: Find specific row by Name, then click its Edit button
    async clickEditForLeaveType(leaveName: string) {
        // Find the exact row that contains our leave name
        const targetRow = this.page.getByRole('row', { name: leaveName });
        
        // Find all buttons inside that specific row and click the second one (Edit/Pencil)
        await targetRow.locator('button').nth(1).click();
    }

    // Find specific row by Name, then click its Delete button
    async clickDeleteForLeaveType(leaveName: string) {
        const targetRow = this.page.getByRole('row', { name: leaveName });
        
        // Click the first button (Delete/Trash) inside that specific row
        await targetRow.locator('button').nth(0).click();
    }

    async confirmDelete() {
        await this.confirmDeleteBtn.click();
    }
}