import { expect, type Page } from '@playwright/test';

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

    await expect(page.getByText('Successfully Saved')).toBeVisible({
        timeout: 15000,
    });

    await expect(page.getByText('Successfully Saved'))
        .toBeHidden({
            timeout: 30000,
        })
        .catch(() => {});

    await eventList.navigateToEvents();
    await eventList.expectEventVisible(eventName);

    console.log(`[SETUP] Event Created and Verified: ${eventName}`);

    return {
        eventName,
        description,
    };
}
