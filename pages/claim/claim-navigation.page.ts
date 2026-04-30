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

        this.submitClaimHeading = page.getByRole('heading', {
            name: /^Create Claim Request$/i,
        });

        this.myClaimsHeading = page.getByRole('heading', {
            name: /^My Claims$/i,
        });
    }

    async navigateToSubmitClaim() {
        await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/submitClaim`, {
            waitUntil: 'domcontentloaded',
        });

        await expect(this.submitClaimHeading).toBeVisible({ timeout: 30000 });
    }

    async navigateToMyClaims() {
        // Do not use /claim/viewMyClaims directly.
        // OrangeHRM local route can reject it. Open Claim module, then click the My Claims tab.
        await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/viewClaimModule`, {
            waitUntil: 'domcontentloaded',
        });

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
