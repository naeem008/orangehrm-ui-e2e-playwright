import { test, expect } from '@playwright/test';

import { EventFormPage } from '../../../pages/claim/event-form.page';
import { EventListPage } from '../../../pages/claim/event-list.page';

function generateEventName(): string {
    return `Annual_Meetup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

test.describe('Claim - Event Management Create', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully create a new Event', async ({ page }) => {
        const eventList = new EventListPage(page);
        const eventForm = new EventFormPage(page);

        const eventName = generateEventName();
        const eventDescription = 'Company annual gathering setup via Playwright.';

        console.log('------------------------------------------------');
        console.log(`[ACTION] Creating Event: ${eventName}`);

        await eventList.navigateToEvents();
        await eventList.clickAddEvent();

        await eventForm.fillEventDetails(eventName, eventDescription);
        await eventForm.clickSave();

        await page
            .locator('.oxd-toast--success')
            .waitFor({
                state: 'visible',
                timeout: 15000,
            })
            .catch(() => {
                console.log('[INFO] Success toast was not detected, checking grid directly.');
            });

        await eventList.expectEventVisible(eventName);

        const createdEventRow = page.locator('.oxd-table-card').filter({
            hasText: eventName,
        });

        await expect(createdEventRow).toBeVisible({ timeout: 30000 });

        console.log(`[SUCCESS] Event "${eventName}" verified in the grid!`);
        console.log('------------------------------------------------');
    });
});
