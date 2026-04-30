import { expect, type Locator, type Page } from '@playwright/test';

export class EventFormPage {
    readonly page: Page;
    readonly eventNameInput: Locator;
    readonly eventDescriptionInput: Locator;
    readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.eventNameInput = page.locator('input').nth(1);
        this.eventDescriptionInput = page.locator('textarea');
        this.saveBtn = page.getByRole('button', { name: 'Save' });
    }

    async fillEventDetails(name: string, description: string) {
        await expect(this.eventNameInput).toBeVisible({ timeout: 15000 });
        await this.eventNameInput.fill(name);

        await expect(this.eventDescriptionInput).toBeVisible({ timeout: 15000 });
        await this.eventDescriptionInput.fill(description);
    }

    async clickSave() {
        await expect(this.saveBtn).toBeVisible({ timeout: 15000 });
        await this.saveBtn.click();
    }
}
