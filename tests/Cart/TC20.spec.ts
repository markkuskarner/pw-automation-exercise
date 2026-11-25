import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { ProductsPage } from '@pages/ProductsPage';

test('search products and verify cart after login', async ({ page, createdUser }) => {
    const mainPage = new MainPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const searchProduct = 'jeans';

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.productsButton.click();

    await productsPage.assertProductsPageIsOpen();
    await productsPage.searchField.fill(searchProduct);
    await productsPage.searchButton.click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    const resultNames = page.locator('.productinfo p');
    await expect(resultNames.first()).toBeVisible();

    //checking that all product are related to searched item
    for (const name of await resultNames.all()) {
        await expect(name).toContainText(searchProduct, { ignoreCase: true }); 
    }
    const availableProducts = await resultNames.allTextContents();

    //adding all these products to cart
    for (const product of await productsPage.productList.all()) {
        await productsPage.addToCart(product);
        await productsPage.clickContinueShoppingButton();
    }

    await productsPage.cartButton.click();
    await cartPage.assertCartPageIsOpen();
    await expect(cartPage.cartRows).toHaveCount(availableProducts.length);
    for(const name of availableProducts) {
       await expect(cartPage.productRow(name)).toBeVisible();
    }
    await cartPage.loginButton.click();

    await loginPage.loginEmailField.fill(createdUser.email);
    await loginPage.loginPassField.fill(createdUser.password);
    await loginPage.loginButton.click();

    await mainPage.cartButton.click();

    await cartPage.assertCartPageIsOpen();
    await expect(cartPage.cartRows).toHaveCount(availableProducts.length);
    for(const name of availableProducts) {
       await expect(cartPage.productRow(name)).toBeVisible();
    }
    
});
