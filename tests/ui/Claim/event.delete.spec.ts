import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { EventListPage } from '../../../pages/claim/event-list.page';

test.describe('Claim - Event Management Delete', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully delete an existing Event', async ({ page }) => {
        const eventList = new EventListPage(page);

        // 1. SETUP & LOG
        const eventData = await createEventSetup(page);

        console.log('------------------------------------------------');
        console.log(`[SETUP] Base Event Created: ${eventData.eventName}`);

        await eventList.navigateToEvents();
        console.log(`[ACTION] Locating Event in the grid to Delete: ${eventData.eventName}`);

        // 2. LOCATE & DELETE
        await eventList.clickDeleteForEvent(eventData.eventName);
        await eventList.confirmDelete();

        // 3. VERIFY & LOG
        await expect(page.getByText('Successfully Deleted')).toBeVisible();

        const deletedRow = page.getByRole('row', { name: eventData.eventName });
        await expect(deletedRow).not.toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Successfully deleted and removed from grid: ${eventData.eventName}`);
        console.log('------------------------------------------------');
    });
});
