import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { faker } from '@faker-js/faker';
import { CartPage } from '@pages/CartPage';

test('verify Subscription in cart page', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.cartButton.click();
    await expect(cartPage.subscriptionText).toBeVisible();
    await cartPage.subEmailField.fill(faker.internet.email());
    await cartPage.subEmailButton.click();
    await expect(page.getByText('You have been successfully')).toBeVisible();
});
