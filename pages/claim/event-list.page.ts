import { Page, Locator } from '@playwright/test';

export class EventListPage {
    readonly page: Page;
    readonly claimMenu: Locator;
    readonly configMenu: Locator;
    readonly eventsMenu: Locator;
    readonly addBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        // Robust sidebar locator
        this.claimMenu = page.locator('.oxd-main-menu-item-wrapper').filter({ hasText: 'Claim' });
        this.configMenu = page.locator('nav.oxd-topbar-body-nav').getByText('Configuration');
        this.eventsMenu = page.getByRole('menuitem', { name: 'Events' });
        this.addBtn = page.getByRole('button', { name: 'Add' });
    }

    async navigateToEvents() {
        await this.claimMenu.click();
        await this.configMenu.click();
        await this.eventsMenu.click();
    }

    async clickAddEvent() {
        await this.addBtn.click();
    }

    async clickEditForEvent(eventName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: eventName });
        await row.locator('.bi-pencil-fill').click();
    }

    async clickDeleteForEvent(eventName: string) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: eventName });
        await row.locator('.bi-trash').click();
    }

    // 🛡️ SENIOR FIX: The missing method that caused the TypeError
    async confirmDelete() {
        await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    }
}
