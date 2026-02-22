import { Page, Locator } from '@playwright/test';

export class NavbarPage {
    readonly page: Page;
    readonly pimMenu: Locator;
    readonly userDropdown: Locator;
    readonly logoutLink: Locator;
    readonly LeaveMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
        this.LeaveMenu = page.getByRole('link', { name: 'Leave' });

        // Locators for Logout flow
        this.userDropdown = page.locator('.oxd-userdropdown-name');
        this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    }

    async goToPIM() {
        await this.pimMenu.click();
    }

    async goToLeave() {
        await this.LeaveMenu.click();
    }

    // Method to perform UI Logout
    async logout() {
        await this.userDropdown.click();
        await this.logoutLink.click();
    }
}