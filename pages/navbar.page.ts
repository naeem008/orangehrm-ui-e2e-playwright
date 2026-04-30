import { expect, type Locator, type Page } from '@playwright/test';

export class NavbarPage {
    readonly page: Page;
    readonly pimMenu: Locator;
    readonly leaveMenu: Locator;
    readonly userDropdown: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pimMenu = page.locator('a.oxd-main-menu-item[href*="/pim/viewPimModule"]');
        this.leaveMenu = page.locator('a.oxd-main-menu-item[href*="/leave/viewLeaveModule"]');

        this.userDropdown = page.locator('.oxd-userdropdown-name');
        this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    }

    async goToPIM() {
        await expect(this.pimMenu).toBeVisible({ timeout: 30000 });
        await this.pimMenu.click();
    }

    async goToLeave() {
        await expect(this.leaveMenu).toBeVisible({ timeout: 30000 });
        await this.leaveMenu.click();
    }

    async logout() {
        await expect(this.userDropdown).toBeVisible({ timeout: 15000 });
        await this.userDropdown.click();
        await expect(this.logoutLink).toBeVisible({ timeout: 15000 });
        await this.logoutLink.click();
    }
}