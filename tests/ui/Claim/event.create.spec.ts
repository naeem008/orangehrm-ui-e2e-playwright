import { test, expect } from '@playwright/test';
import { EventListPage } from '../../../pages/claim/event-list.page';
import { EventFormPage } from '../../../pages/claim/event-form.page';

test.describe('Claim - Event Management Create', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${process.env.BASE_URL}/web/index.php/dashboard/index`, { waitUntil: 'domcontentloaded' });
    });

    test('Should successfully create a new Event', async ({ page }) => {
        const eventList = new EventListPage(page);
        const eventForm = new EventFormPage(page);

        // Dynamic test data generation
        const eventName = `Annual_Meetup_${Date.now().toString().slice(-4)}`;
        const eventDescription = 'Company annual gathering setup via Playwright.';

        console.log('------------------------------------------------');
        console.log(`[ACTION] Creating Event: ${eventName}`);

        // Navigation and Action
        await eventList.navigateToEvents();
        await eventList.clickAddEvent();
        await eventForm.fillEventDetails(eventName, eventDescription);
        await eventForm.clickSave();

        // Verification
        await expect(page.getByText('Successfully Saved')).toBeVisible();

        // Ensure the newly created event is visible in the data table
        const createdRow = page.getByRole('row', { name: eventName });
        await expect(createdRow).toBeVisible({ timeout: 10000 });

        console.log(`[SUCCESS] Event "${eventName}" verified in the grid!`);
        console.log('------------------------------------------------');
    });
});
