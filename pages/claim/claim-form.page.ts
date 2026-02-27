import { Page, Locator, expect } from '@playwright/test';
import path from 'path';

export class ClaimFormPage {
    readonly page: Page;
    readonly eventDropdown: Locator;
    readonly currencyDropdown: Locator;
    readonly createButton: Locator;
    readonly finalSubmitButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventDropdown = page.locator('.oxd-select-wrapper').first();
        this.currencyDropdown = page.locator('.oxd-select-wrapper').nth(1);
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.finalSubmitButton = page.getByRole('button', { name: 'Submit' });
        // 'Back' button locator from the bottom of the page
        this.backButton = page.getByRole('button', { name: 'Back' });
    }

    async verifyTotalAmount(expectedAmount: string) {
        console.log(`[ACTION] Verifying Total Amount matches: ${expectedAmount}`);
        // Using your provided locator strategy based on HTML structure
        const totalAmountText = this.page.locator('p.oxd-text', { hasText: /Total Amount/ });
        await expect(totalAmountText).toContainText(expectedAmount);
    }

    async clickBack() {
        await this.backButton.click();
        console.log(`[ACTION] Clicked Back button to return to My Claims.`);
    }

    // ... (previous addExpense and uploadAttachment methods remain same)
    async addExpense(type: string, date: string, amount: string) {
        await this.page
            .locator('div.orangehrm-horizontal-padding:has-text("Expenses")')
            .getByRole('button', { name: 'Add' })
            .click();
        await this.page.locator('.oxd-select-wrapper').click();
        await this.page.getByRole('option', { name: type }).click();
        await this.page.locator('input[placeholder="yyyy-mm-dd"]').fill(date);
        await this.page.locator('div.oxd-grid-2 input').nth(1).fill(amount);
        await this.page.getByRole('button', { name: 'Save' }).click();
        await this.page.waitForSelector('.oxd-dialog-container-default', { state: 'hidden' });
    }

    async uploadAttachment(fileName: string) {
        await this.page
            .locator('div.orangehrm-horizontal-padding:has-text("Attachments")')
            .getByRole('button', { name: 'Add' })
            .click();

        const filePath = path.resolve(process.cwd(), 'test-data', fileName);
        await this.page.locator('input[type="file"]').setInputFiles(filePath);

        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.page.getByText('Successfully Saved')).toBeVisible();

        // 🚀 THE FIX: Wait for the modal background overlay to completely disappear
        // before allowing the script to proceed to the final Submit button.
        await this.page.waitForSelector('.oxd-dialog-container-default', { state: 'hidden' });
    }
}
