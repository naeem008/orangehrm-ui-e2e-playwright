import { expect, type Locator, type Page } from '@playwright/test';
import path from 'path';

export class ClaimFormPage {
    readonly page: Page;
    readonly eventDropdown: Locator;
    readonly currencyDropdown: Locator;
    readonly remarksTextarea: Locator;
    readonly createButton: Locator;
    readonly submitButton: Locator;
    readonly finalSubmitButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.eventDropdown = page.locator('.oxd-select-wrapper').first();
        this.currencyDropdown = page.locator('.oxd-select-wrapper').nth(1);
        this.remarksTextarea = page.locator('textarea');

        this.createButton = page.getByRole('button', { name: 'Create' });

        // Keep both names because existing tests use finalSubmitButton.
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.finalSubmitButton = this.submitButton;

        this.backButton = page.getByRole('button', { name: 'Back' });
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
        await expect(this.finalSubmitButton).toBeVisible({ timeout: 15000 });
        await this.finalSubmitButton.click();
    }

    async clickBack() {
        await expect(this.backButton).toBeVisible({ timeout: 15000 });
        await this.backButton.click();

        console.log('[ACTION] Clicked Back button to return to My Claims.');
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

        const amountInput = dialog.locator('div.oxd-grid-2 input').nth(1);
        await expect(amountInput).toBeVisible({ timeout: 15000 });
        await amountInput.fill(amount);

        const saveButton = dialog.getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 15000 });
        await saveButton.click();

        await expect(this.page.getByText('Successfully Saved')).toBeVisible({
            timeout: 15000,
        });

        await expect(dialog).toBeHidden({ timeout: 30000 });
    }

    async uploadAttachment(fileName: string) {
        const addAttachmentButton = this.page
            .locator('div.orangehrm-horizontal-padding:has-text("Attachments")')
            .getByRole('button', { name: 'Add' });

        await expect(addAttachmentButton).toBeVisible({ timeout: 30000 });
        await addAttachmentButton.click();

        const dialog = this.page.locator('.oxd-dialog-container-default');
        await expect(dialog).toBeVisible({ timeout: 30000 });

        const filePath = path.resolve(process.cwd(), 'test-data', fileName);

        const fileInput = dialog.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);

        const saveButton = dialog.getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 15000 });
        await saveButton.click();

        await expect(this.page.getByText('Successfully Saved')).toBeVisible({
            timeout: 15000,
        });

        await expect(dialog).toBeHidden({ timeout: 30000 });
    }

    async verifyTotalAmount(expectedAmount: string) {
        console.log(`[ACTION] Verifying Total Amount matches: ${expectedAmount}`);

        const totalAmountText = this.page.locator('p.oxd-text', {
            hasText: /Total Amount/,
        });

        await expect(totalAmountText).toContainText(expectedAmount, {
            timeout: 30000,
        });
    }
}
