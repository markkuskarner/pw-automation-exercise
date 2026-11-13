import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { faker } from '@faker-js/faker';

test('verify Subscription in home page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await expect(mainPage.subscriptionText).toBeVisible();
    await mainPage.subEmailField.fill(faker.internet.email());
    await mainPage.subEmailButton.click();
    await expect(page.getByText('You have been successfully')).toBeVisible();
});
