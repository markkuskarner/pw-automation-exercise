import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { CartPage } from '@pages/CartPage';
import { ProductsPage } from '@pages/ProductsPage';

test('add products in cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const productsPage = new ProductsPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();

    const firstProductName = await productsPage.firstProductName.textContent();
    const secondProductName = await productsPage.secondProductName.textContent();
    const firstProductPrice = await productsPage.firstProductPrice.textContent();
    const secondProductPrice = await productsPage.secondProductPrice.textContent();

    await productsPage.addToCart(productsPage.firstProduct);
    await productsPage.clickContinueShoppingButton();
    await productsPage.addToCart(productsPage.secondProduct);

    await productsPage.viewCartButton.click();
    await expect(cartPage.cartRows).toHaveCount(2);

    const firstRow = cartPage.productRow(firstProductName!);
    await expect(firstRow).toBeVisible();
    await expect(firstRow.locator('.cart_price')).toHaveText(firstProductPrice!);
    await expect(firstRow.locator('.cart_quantity')).toHaveText('1');
    await expect(firstRow.locator('.cart_total')).toHaveText(firstProductPrice!);

    const secondRow = cartPage.productRow(secondProductName!);
    await expect(secondRow).toBeVisible();
    await expect(secondRow.locator('.cart_price')).toHaveText(secondProductPrice!);
    await expect(secondRow.locator('.cart_quantity')).toHaveText('1');
    await expect(secondRow.locator('.cart_total')).toHaveText(secondProductPrice!);
});
