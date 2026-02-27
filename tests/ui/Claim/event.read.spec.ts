import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { EventListPage } from '../../../pages/claim/event-list.page';

test.describe('Claim - Event Management Read', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully read/view an existing Event', async ({ page }) => {
        const eventList = new EventListPage(page);

        // 1. SETUP & LOG
        const eventData = await createEventSetup(page);
        console.log('------------------------------------------------');
        console.log(`[SETUP] Base Event Created: ${eventData.eventName}`);

        // 2. NAVIGATE & LOCATE
        await eventList.navigateToEvents();
        console.log(`[ACTION] Locating Event in the grid: ${eventData.eventName}`);

        // 3. VERIFY & LOG
        const targetRow = page.getByRole('row', { name: eventData.eventName });
        await expect(targetRow).toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Successfully read/verified UI visibility for: ${eventData.eventName}`);
        console.log('------------------------------------------------');
    });
});
