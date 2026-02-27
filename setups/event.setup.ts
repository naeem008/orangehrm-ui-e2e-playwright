import { Page, expect } from '@playwright/test';
import { EventListPage } from '../pages/claim/event-list.page';
import { EventFormPage } from '../pages/claim/event-form.page';

export async function createEventSetup(page: Page) {
    const eventList = new EventListPage(page);
    const eventForm = new EventFormPage(page);

    const uniqueId = Date.now().toString().slice(-4);
    const eventName = `BaseEvent_${uniqueId}`;
    const description = `Auto-generated setup description for ${eventName}`;

    console.log(`[SETUP] Generating prerequisite Event: ${eventName}`);

    await eventList.navigateToEvents();
    await eventList.clickAddEvent();
    await eventForm.fillEventDetails(eventName, description);
    await eventForm.clickSave();

    // Ensure save is complete before returning
    await expect(page.getByText('Successfully Saved')).toBeVisible();
    await page.waitForLoadState('domcontentloaded');

    return { eventName, description };
}
