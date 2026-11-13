import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { ProductsPage } from '@pages/ProductsPage';

test('search product', async ({ page }) => {
    const mainPage = new MainPage(page);
    const productsPage = new ProductsPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();
    await productsPage.assertProductsPageIsOpen();
    const searchProduct = 'jeans';

    await productsPage.searchField.fill(searchProduct);
    await productsPage.searchButton.click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

    const resultNames = page.locator('.productinfo p');
    await expect(resultNames.first()).toBeVisible();

    for (const name of await resultNames.all()) {
        await expect(name).toContainText(searchProduct, { ignoreCase: true });
    }
});
