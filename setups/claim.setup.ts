import { type Page } from '@playwright/test';
import { createEventSetup } from './event.setup';
import { ClaimFormPage } from '../pages/claim/claim-form.page';
import { ClaimNavigationPage } from '../pages/claim/claim-navigation.page';

type ClaimExpense = {
    type: string;
    amount: string;
};

type ClaimSetupOptions = {
    expenses: ClaimExpense[];
    submit?: boolean;
    uploadReceipt?: boolean;
    remarks?: string;
};

function getTodayIsoDate(): string {
    return new Date().toISOString().split('T')[0];
}

function formatAmount(expenses: ClaimExpense[]): string {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    return total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export async function createSelfClaim(page: Page, options: ClaimSetupOptions) {
    const claimNavigation = new ClaimNavigationPage(page);
    const claimForm = new ClaimFormPage(page);
    const eventData = await createEventSetup(page);
    const today = getTodayIsoDate();
    const expectedTotal = formatAmount(options.expenses);

    await claimNavigation.navigateToSubmitClaim();

    await claimForm.selectEvent(eventData.eventName);
    await claimForm.selectCurrency('Bangladeshi Taka');

    if (options.remarks) {
        await claimForm.fillRemarks(options.remarks);
    }

    await claimForm.clickCreate();

    for (const expense of options.expenses) {
        await claimForm.addExpense(expense.type, today, expense.amount);
    }

    if (options.uploadReceipt) {
        await claimForm.uploadAttachment('receipt.txt');
    }

    await claimForm.verifyTotalAmount(expectedTotal);

    if (options.submit) {
        await claimForm.clickSubmit();

        await page.getByText('Successfully Submitted').or(page.getByText('Successfully Saved')).waitFor({
            state: 'visible',
            timeout: 15000,
        });

        await page
            .locator('.oxd-toast--success')
            .waitFor({
                state: 'hidden',
                timeout: 30000,
            })
            .catch(() => {
                console.log('[INFO] Success toast did not hide within timeout, continuing.');
            });
    }

    return {
        eventName: eventData.eventName,
        expectedTotal,
        today,
    };
}
