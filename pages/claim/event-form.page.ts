import { Page, Locator } from '@playwright/test';

export class EventFormPage { // Ei nam-ta thaktei hobe
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
        await this.eventNameInput.fill(name);
        await this.eventDescriptionInput.fill(description);
    }

    async clickSave() {
        await this.saveBtn.click();
    }
}