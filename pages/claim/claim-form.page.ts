import { expect, type Locator, type Page } from '@playwright/test';

export class ClaimFormPage {
    readonly page: Page;
    readonly eventDropdown: Locator;
    readonly currencyDropdown: Locator;
    readonly remarksTextarea: Locator;
    readonly createButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.eventDropdown = page.locator('.oxd-select-wrapper').nth(0);
        this.currencyDropdown = page.locator('.oxd-select-wrapper').nth(1);
        this.remarksTextarea = page.locator('textarea');
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    async selectEvent(eventName: string) {
        await expect(this.eventDropdown).toBeVisible({ timeout: 30000 });
        await this.eventDropdown.click();

        const eventOption = this.page.getByRole('option', { name: eventName });
        await expect(eventOption).toBeVisible({ timeout: 30000 });
        await eventOption.click();
    }

    async selectCurrency(currencyName: string) {
        await expect(this.currencyDropdown).toBeVisible({ timeout: 30000 });
        await this.currencyDropdown.click();

        const currencyOption = this.page.getByRole('option', { name: currencyName });
        await expect(currencyOption).toBeVisible({ timeout: 30000 });
        await currencyOption.click();
    }

    async fillRemarks(remarks: string) {
        await expect(this.remarksTextarea).toBeVisible({ timeout: 15000 });
        await this.remarksTextarea.fill(remarks);
    }

    async clickCreate() {
        await expect(this.createButton).toBeVisible({ timeout: 15000 });
        await this.createButton.click();
    }

    async clickSubmit() {
        await expect(this.submitButton).toBeVisible({ timeout: 15000 });
        await this.submitButton.click();
    }

    async addExpense(type: string, date: string, amount: string) {
        const addExpenseButton = this.page
            .locator('div.orangehrm-horizontal-padding:has-text("Expenses")')
            .getByRole('button', { name: 'Add' });

        await expect(addExpenseButton).toBeVisible({ timeout: 30000 });
        await addExpenseButton.click();

        const dialog = this.page.locator('.oxd-dialog-container-default');
        await expect(dialog).toBeVisible({ timeout: 30000 });

        const expenseTypeDropdown = dialog.locator('.oxd-select-wrapper');
        await expect(expenseTypeDropdown).toBeVisible({ timeout: 15000 });
        await expenseTypeDropdown.click();

        const expenseOption = this.page.getByRole('option', { name: type });
        await expect(expenseOption).toBeVisible({ timeout: 15000 });
        await expenseOption.click();

        const dateInput = dialog.locator('input[placeholder="yyyy-mm-dd"]');
        await expect(dateInput).toBeVisible({ timeout: 15000 });
        await dateInput.fill(date);

        const amountInput = dialog.locator('input').nth(1);
        await expect(amountInput).toBeVisible({ timeout: 15000 });
        await amountInput.fill(amount);

        await dialog.getByRole('button', { name: 'Save' }).click();

        await expect(this.page.getByText('Successfully Saved')).toBeVisible({
            timeout: 15000,
        });

        await expect(dialog).toBeHidden({ timeout: 30000 });
    }

    async verifyTotalAmount(amount: string) {
        await expect(this.page.getByText(amount)).toBeVisible({ timeout: 30000 });
    }
}
