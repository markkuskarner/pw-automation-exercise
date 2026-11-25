import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { MainPage } from '@pages/MainPage';

test('add to cart from recommended items', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const recomItems = page.locator('#recommended-item-carousel');
    const visibleItems = recomItems.locator('.item.active');
    

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await expect(page.locator('.recommended_items')).toBeVisible();

    const product = visibleItems.locator('.product-image-wrapper').first();
    const productName = await product.locator('.productinfo p').textContent();


    await visibleItems.getByText('Add to cart').first().click();
    await mainPage.viewCartButton.click();
    await expect(cartPage.productRow(productName!)).toBeVisible();
});