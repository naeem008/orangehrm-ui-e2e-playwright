import { expect, type Locator, type Page } from '@playwright/test';

export class ClaimNavigationPage {
    readonly page: Page;
    readonly claimMenu: Locator;
    readonly submitClaimLink: Locator;
    readonly myClaimsLink: Locator;
    readonly submitClaimHeading: Locator;
    readonly myClaimsHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        this.claimMenu = page.locator('a.oxd-main-menu-item[href*="/claim/viewClaimModule"]');
        this.submitClaimLink = page.getByRole('link', { name: 'Submit Claim' });
        this.myClaimsLink = page.getByRole('link', { name: 'My Claims' });

        this.submitClaimHeading = page.getByRole('heading', { name: /^Submit Claim$/i });
        this.myClaimsHeading = page.getByRole('heading', { name: /^My Claims$/i });
    }

    async navigateToSubmitClaim() {
        await expect(this.claimMenu).toBeVisible({ timeout: 30000 });
        await this.claimMenu.click();

        await expect(this.submitClaimLink).toBeVisible({ timeout: 30000 });
        await this.submitClaimLink.click();

        await expect(this.submitClaimHeading).toBeVisible({ timeout: 30000 });
    }

    async navigateToMyClaims() {
        await expect(this.claimMenu).toBeVisible({ timeout: 30000 });
        await this.claimMenu.click();

        await expect(this.myClaimsLink).toBeVisible({ timeout: 30000 });
        await this.myClaimsLink.click();

        await expect(this.myClaimsHeading).toBeVisible({ timeout: 30000 });
    }

    async expectClaimRowVisible(eventName: string) {
        const row = this.page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(row).toBeVisible({ timeout: 30000 });

        return row;
    }
}
