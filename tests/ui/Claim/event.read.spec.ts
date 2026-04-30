import { test, expect } from '@playwright/test';

import { createEventSetup } from '../../../setups/event.setup';
import { EventListPage } from '../../../pages/claim/event-list.page';

test.describe('Claim - Event Management Read', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully read/view an existing Event', async ({ page }) => {
        const eventList = new EventListPage(page);

        const eventData = await createEventSetup(page);

        console.log('------------------------------------------------');
        console.log(`[SETUP] Event Created: ${eventData.eventName}`);
        console.log(`[ACTION] Reading/verifying Event in the grid: ${eventData.eventName}`);

        await eventList.expectEventVisible(eventData.eventName);

        const targetRow = page.locator('.oxd-table-card').filter({
            hasText: eventData.eventName,
        });

        await expect(targetRow).toBeVisible({ timeout: 30000 });
        await expect(targetRow).toContainText('Active');

        console.log(`[SUCCESS] Successfully read/verified Event: ${eventData.eventName}`);
        console.log('------------------------------------------------');
    });
});
