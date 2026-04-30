import { expect, type Locator, type Page } from '@playwright/test';

export class EventListPage {
    readonly page: Page;
    readonly claimMenu: Locator;
    readonly configMenu: Locator;
    readonly eventsMenu: Locator;
    readonly addBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.claimMenu = page.locator('a.oxd-main-menu-item[href*="/claim/viewClaimModule"]');
        this.configMenu = page.locator('nav.oxd-topbar-body-nav').getByText('Configuration');
        this.eventsMenu = page.getByRole('menuitem', { name: 'Events' });
        this.addBtn = page.getByRole('button', { name: 'Add' });
    }

    async navigateToEvents() {
        await expect(this.claimMenu).toBeVisible({ timeout: 30000 });
        await this.claimMenu.click();

        await expect(this.configMenu).toBeVisible({ timeout: 30000 });
        await this.configMenu.click();

        await expect(this.eventsMenu).toBeVisible({ timeout: 30000 });

        await Promise.all([
            this.page.waitForURL(/.*\/claim\/events.*/, { timeout: 30000 }),
            this.eventsMenu.click(),
        ]);

        await expect(this.addBtn).toBeVisible({ timeout: 30000 });
    }

    async clickAddEvent() {
        await expect(this.addBtn).toBeVisible({ timeout: 15000 });
        await this.addBtn.click();
    }

    async clickEditForEvent(eventName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: eventName });
        await expect(row).toBeVisible({ timeout: 30000 });
        await row.locator('.bi-pencil-fill').click();
    }

    async clickDeleteForEvent(eventName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: eventName });
        await expect(row).toBeVisible({ timeout: 30000 });
        await row.locator('.bi-trash').click();
    }

    async confirmDelete() {
        const confirmBtn = this.page.getByRole('button', { name: 'Yes, Delete' });
        await expect(confirmBtn).toBeVisible({ timeout: 15000 });
        await confirmBtn.click();
    }
}