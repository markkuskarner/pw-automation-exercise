import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { MainPage } from '@pages/MainPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';

test('verify product quantity in cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    const productDetPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const quantity = '4';

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.clickFirstViewProductButton();
    await productDetPage.assertProductDetailedPageIsVisible();
    const productName = await productDetPage.productName.textContent();
    await productDetPage.quantityField.fill(quantity);
    await productDetPage.clickAddToCartButton();
    await productDetPage.clickViewCartButton();
    const productRow = cartPage.productRow(productName!);

    await expect(productRow).toBeVisible();
    await expect(productRow.locator('.cart_quantity')).toHaveText(quantity);
});
