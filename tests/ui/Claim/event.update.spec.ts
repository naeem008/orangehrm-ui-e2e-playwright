import { test, expect } from '@playwright/test';
import { createEventSetup } from '../../../setups/event.setup';
import { EventListPage } from '../../../pages/claim/event-list.page';
import { EventFormPage } from '../../../pages/claim/event-form.page';

test.describe('Claim - Event Management Update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully edit an existing Event', async ({ page }) => {
        const eventList = new EventListPage(page);
        const eventForm = new EventFormPage(page);

        // 1. SETUP & LOG
        const eventData = await createEventSetup(page);
        const updatedEventName = `UpdatedEvent_${Date.now().toString().slice(-4)}`;

        console.log('------------------------------------------------');
        console.log(`[SETUP] Base Event Created: ${eventData.eventName}`);
        console.log(`[ACTION] Target Update Name: ${updatedEventName}`);

        await eventList.navigateToEvents();
        console.log(`[ACTION] Locating Event in the grid to Edit: ${eventData.eventName}`);

        // 2. LOCATE & EDIT
        await eventList.clickEditForEvent(eventData.eventName);

        // Dynamic wait to prevent race condition
        await expect(eventForm.eventNameInput).toHaveValue(eventData.eventName, { timeout: 10000 });

        await eventForm.eventNameInput.clear();
        await expect(eventForm.eventNameInput).toBeEmpty();
        await eventForm.eventNameInput.fill(updatedEventName);
        await expect(eventForm.eventNameInput).toHaveValue(updatedEventName);
        await eventForm.clickSave();

        // 3. VERIFY & LOG
        await expect(page.getByText('Successfully Updated')).toBeVisible();
        const updatedRow = page.getByRole('row', { name: updatedEventName });
        await expect(updatedRow).toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Successfully updated and verified in grid: ${updatedEventName}`);
        console.log('------------------------------------------------');
    });
});
