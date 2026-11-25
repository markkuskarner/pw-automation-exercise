import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';

test('view & cart brand products', async ({ page }) => {
    const mainPage = new MainPage(page);
    const brands = page.locator('.brands_products');

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();
    await expect(brands).toBeVisible();
    await brands.getByRole('link', { name: 'Polo'}).click();
    await expect(page.getByText('Brand - Polo Products')).toBeVisible();
    await brands.getByRole('link', {name : 'Biba'}).click();
    await expect(page.getByText('Brand - Biba Products')).toBeVisible();
   
});
