import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { faker } from '@faker-js/faker';

test('add review on product', async ({ page }) => {
    const mainPage = new MainPage(page);
    const productsPage = new ProductsPage(page);
    const productDetailPage = new ProductDetailsPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();
    await productsPage.assertProductsPageIsOpen();
    await productsPage.firstViewProductButton.click();
    await productDetailPage.yourNameTextField.fill(faker.person.fullName());
    await productDetailPage.yourEmailTextField.fill(faker.internet.email());
    await productDetailPage.yourReviewTextField.fill(faker.lorem.paragraph());
    await productDetailPage.submitReviewButton.click();
    await expect(page.getByText('Thank you for your review.')).toBeVisible();
});
