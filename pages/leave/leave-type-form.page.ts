import { Page, Locator } from '@playwright/test';

export class LeaveTypeFormPage {
    readonly page: Page;
    readonly leaveTypeNameInput: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.leaveTypeNameInput = page.locator('form').getByRole('textbox');
        this.saveBtn = page.getByRole('button', { name: 'Save' });
    }

    async fillLeaveTypeName(name: string) {
        await this.leaveTypeNameInput.fill(name);
    }

    async clickSave() {
        await this.saveBtn.click();
    }
}