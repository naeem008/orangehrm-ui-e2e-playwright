import { type Page } from '@playwright/test';

import { EventFormPage } from '../pages/claim/event-form.page';
import { EventListPage } from '../pages/claim/event-list.page';

function generateUniqueEventName(): string {
    return `BaseEvent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createEventSetup(page: Page) {
    const eventList = new EventListPage(page);
    const eventForm = new EventFormPage(page);

    const eventName = generateUniqueEventName();
    const description = `Auto-generated setup description for ${eventName}`;

    console.log(`[SETUP] Creating prerequisite Event: ${eventName}`);

    await eventList.navigateToEvents();
    await eventList.clickAddEvent();

    await eventForm.fillEventDetails(eventName, description);
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

    await page
        .locator('.oxd-toast--success')
        .waitFor({
            state: 'hidden',
            timeout: 30000,
        })
        .catch(() => {
            console.log('[INFO] Success toast did not hide within timeout, continuing.');
        });

    await eventList.expectEventVisible(eventName);

    console.log(`[SETUP] Event Created and Verified: ${eventName}`);

    return {
        eventName,
        description,
    };
}
