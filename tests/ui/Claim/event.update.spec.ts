import { test, expect } from '@playwright/test';

import { createEventSetup } from '../../../setups/event.setup';
import { EventListPage } from '../../../pages/claim/event-list.page';
import { EventFormPage } from '../../../pages/claim/event-form.page';

test.describe('Claim - Event Management Update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, {
            waitUntil: 'domcontentloaded',
        });
    });

    test('Should successfully edit an existing Event', async ({ page }) => {
        const eventList = new EventListPage(page);
        const eventForm = new EventFormPage(page);

        const eventData = await createEventSetup(page);

        const updatedEventName = `UpdatedEvent_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`;

        console.log('------------------------------------------------');
        console.log(`[SETUP] Base Event Created: ${eventData.eventName}`);
        console.log(`[ACTION] Target Update Name: ${updatedEventName}`);

        await eventList.navigateToEvents();

        console.log(`[ACTION] Locating Event in the grid to Edit: ${eventData.eventName}`);

        await eventList.clickEditForEvent(eventData.eventName);

        await expect(eventForm.eventNameInput).toBeVisible({ timeout: 15000 });
        await expect(eventForm.eventNameInput).toHaveValue(eventData.eventName, {
            timeout: 15000,
        });

        await eventForm.eventNameInput.clear();
        await expect(eventForm.eventNameInput).toBeEmpty();

        await eventForm.eventNameInput.fill(updatedEventName);
        await expect(eventForm.eventNameInput).toHaveValue(updatedEventName);

        await eventForm.clickSave();

        await expect(page.getByText('Successfully Updated')).toBeVisible({
            timeout: 15000,
        });

        await eventList.navigateToEvents();

        const updatedRow = page.locator('.oxd-table-card').filter({
            hasText: updatedEventName,
        });

        await expect(updatedRow).toBeVisible({ timeout: 30000 });

        console.log(`[SUCCESS] Successfully updated and verified in grid: ${updatedEventName}`);
        console.log('------------------------------------------------');
    });
});