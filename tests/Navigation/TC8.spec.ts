import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';

test('verify all products and product detail page', async ({ page }) => {
    const mainPage = new MainPage(page);
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();

    await productsPage.assertProductsPageIsOpen();
    await expect(productsPage.productList.first()).toBeVisible();
    await expect(productsPage.productList.last()).toBeVisible();

    const firstProductName = await productsPage.firstProductName.textContent();
    await productsPage.firstViewProductButton.click();

    await expect(page).toHaveURL(/product_details\/\d+/);
    await productDetailsPage.assertProductDetailedPageIsVisible();

    const details = productDetailsPage.productInformation;
    await expect(productDetailsPage.productName).toHaveText(firstProductName!);
    await expect(details).toContainText(/Category:\s*\S+/);
    await expect(details).toContainText(/Rs\.\s*\d+/);
    await expect(details).toContainText(/Availability:\s*\S+/);
    await expect(details).toContainText(/Condition:\s*\S+/);
    await expect(details).toContainText(/Brand:\s*\S+/);
});
