import { expect, type Locator, type Page } from '@playwright/test';

export class EventListPage {
    readonly page: Page;
    readonly addBtn: Locator;
    readonly pageHeading: Locator;
    readonly eventNameSearchInput: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addBtn = page.getByRole('button', { name: 'Add' });
        this.pageHeading = page.getByRole('heading', { name: /^Events$/i });

        this.eventNameSearchInput = page
            .locator('label', { hasText: 'Event Name' })
            .locator('xpath=following::input[1]');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
    }

    async navigateToEvents() {
        await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/viewEvents`, {
            waitUntil: 'domcontentloaded',
        });

        await expect(this.page).toHaveURL(/.*\/claim\/viewEvents.*/, {
            timeout: 30000,
        });

        await expect(this.pageHeading).toBeVisible({ timeout: 30000 });
        await expect(this.addBtn).toBeVisible({ timeout: 30000 });
    }

    async searchEvent(eventName: string) {
        await expect(this.eventNameSearchInput).toBeVisible({ timeout: 30000 });
        await this.eventNameSearchInput.fill(eventName);

        await expect(this.searchButton).toBeVisible({ timeout: 15000 });
        await this.searchButton.click();

        await expect(this.page.locator('.oxd-table-card').first()).toBeVisible({
            timeout: 30000,
        });
    }

    async clickAddEvent() {
        await expect(this.addBtn).toBeVisible({ timeout: 15000 });
        await this.addBtn.click();
    }

    async clickEditForEvent(eventName: string) {
        await this.navigateToEvents();
        await this.searchEvent(eventName);

        const row = this.page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(row).toBeVisible({ timeout: 30000 });

        const editButton = row.locator('.bi-pencil-fill');
        await expect(editButton).toBeVisible({ timeout: 15000 });
        await editButton.click();
    }

    async clickDeleteForEvent(eventName: string) {
        await this.navigateToEvents();
        await this.searchEvent(eventName);

        const row = this.page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(row).toBeVisible({ timeout: 30000 });

        const deleteButton = row.locator('.bi-trash');
        await expect(deleteButton).toBeVisible({ timeout: 15000 });
        await deleteButton.click();
    }

    async confirmDelete() {
        const confirmBtn = this.page.getByRole('button', { name: 'Yes, Delete' });

        await expect(confirmBtn).toBeVisible({ timeout: 15000 });
        await confirmBtn.click();
    }

    async expectEventVisible(eventName: string) {
        await this.navigateToEvents();
        await this.searchEvent(eventName);

        const row = this.page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(row).toBeVisible({ timeout: 30000 });
    }

    async expectEventNotVisible(eventName: string) {
        await this.navigateToEvents();

        await expect(this.eventNameSearchInput).toBeVisible({ timeout: 30000 });
        await this.eventNameSearchInput.fill(eventName);

        await expect(this.searchButton).toBeVisible({ timeout: 15000 });
        await this.searchButton.click();

        const row = this.page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(row).toHaveCount(0, { timeout: 30000 });
    }
}
