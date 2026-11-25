import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { CartPage } from '@pages/CartPage';
import { ProductsPage } from '@pages/ProductsPage';

test('remove products from cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();

    const firstProductName = await productsPage.firstProductName.textContent();

    await productsPage.addToCart(productsPage.firstProduct);
    await productsPage.viewCartButton.click();
    await expect(cartPage.cartRows).toHaveCount(1);

    const firstRow = cartPage.productRow(firstProductName!);
    await expect(firstRow).toBeVisible();
    await cartPage.productRow(firstProductName!).locator('.cart_quantity_delete').click();
    await expect(cartPage.productRow(firstProductName!)).toHaveCount(0);
});
