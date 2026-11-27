import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { createCardData } from '@data/cardFactory';
import { createUserData } from '@data/userFactory';
import { test, expect } from '@fixtures/fixtures';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';
import { PaymentPage } from '@pages/PaymentPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignUpPage } from '@pages/SignupPage';

test.describe('Cart', { tag: '@regression' }, () => {
    let mainPage: MainPage;
    let cartPage: CartPage;
    let productsPage: ProductsPage;
    let productDetPage: ProductDetailsPage;
    let loginPage: LoginPage;
    let signupPage: SignUpPage;
    let accCreatedPage: AccCreatedPage;
    let accDeletedPage: AccDeletedPage;
    let checkoutPage: CheckoutPage;
    let paymentPage: PaymentPage;
    let paymentDonePage: PaymentDonePage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        cartPage = new CartPage(page);
        productsPage = new ProductsPage(page);
        productDetPage = new ProductDetailsPage(page);
        loginPage = new LoginPage(page);
        signupPage = new SignUpPage(page);
        accCreatedPage = new AccCreatedPage(page);
        accDeletedPage = new AccDeletedPage(page);
        checkoutPage = new CheckoutPage(page);
        paymentPage = new PaymentPage(page);
        paymentDonePage = new PaymentDonePage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
    });

    test('user can subscribe from cart page', { tag: '@TC11' }, async ({ page }) => {
        await mainPage.cartButton.click();
        await expect(cartPage.subscriptionText).toBeVisible();
        await cartPage.subEmailField.fill(faker.internet.email());
        await cartPage.subEmailButton.click();
        await expect(page.getByText('You have been successfully')).toBeVisible();
    });

    test('user can add products to cart', { tag: ['@TC12', '@smoke'] }, async () => {
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

    test('cart keeps the quantity chosen on product details page', { tag: '@TC13' }, async () => {
        const quantity = '4';

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

    test('user can place order when registering during checkout', { tag: '@TC14' }, async ({ page }) => {
        const user = createUserData();
        const card = createCardData();

        await mainPage.clickFirstAddToCartButton();
        await mainPage.clickViewCartButton();

        await cartPage.assertCartPageIsOpen();
        await cartPage.proceedToCheckoutButton.click();
        await cartPage.regLogButton.click();

        await loginPage.startSignUp(user.name, user.email);

        await signupPage.fillAccountInformation(user);
        await signupPage.createAccountButton.click();

        await accCreatedPage.assertAccCreatedPageIsVisible();
        await accCreatedPage.contButton.click();

        await expect(mainPage.logginedUserText).toContainText(user.name);
        await mainPage.cartButton.click();

        await cartPage.proceedToCheckoutButton.click();

        await checkoutPage.assertAddress(checkoutPage.deliveryAddress, user);
        await checkoutPage.assertAddress(checkoutPage.billingAddress, user);

        const randomComment = faker.lorem.sentence();

        await checkoutPage.orderCommentTextArea.fill(randomComment);
        await checkoutPage.placeOrderButton.click();

        await paymentPage.fillPaymentDetails(card);
        await paymentPage.payButton.click();

        await paymentDonePage.assertOrderPlaced();
        await paymentDonePage.continueButton.click();

        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });

    test('user can place order when registering before checkout', { tag: '@TC15' }, async () => {
        const user = createUserData();
        const card = createCardData();

        await mainPage.loginButton.click();

        await loginPage.startSignUp(user.name, user.email);

        await signupPage.fillAccountInformation(user);
        await signupPage.createAccountButton.click();

        await accCreatedPage.assertAccCreatedPageIsVisible();
        await accCreatedPage.contButton.click();

        await expect(mainPage.logginedUserText).toContainText(user.name);
        await mainPage.clickFirstAddToCartButton();
        await mainPage.continueShoppingButton.click();
        await mainPage.cartButton.click();

        await cartPage.assertCartPageIsOpen();
        await cartPage.proceedToCheckoutButton.click();

        await checkoutPage.assertAddress(checkoutPage.deliveryAddress, user);
        await checkoutPage.assertAddress(checkoutPage.billingAddress, user);

        const randomComment = faker.lorem.sentence();

        await checkoutPage.orderCommentTextArea.fill(randomComment);
        await checkoutPage.placeOrderButton.click();

        await paymentPage.fillPaymentDetails(card);
        await paymentPage.payButton.click();

        await paymentDonePage.assertOrderPlaced();
        await paymentDonePage.continueButton.click();

        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });

    test('user can place order when logging in before checkout', { tag: ['@TC16', '@smoke'] }, async ({ createdUser }) => {
        const card = createCardData();

        await mainPage.loginButton.click();

        await loginPage.loginEmailField.fill(createdUser.email);
        await loginPage.loginPassField.fill(createdUser.password);
        await loginPage.loginButton.click();

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.clickFirstAddToCartButton();
        await mainPage.continueShoppingButton.click();
        await mainPage.cartButton.click();

        await cartPage.assertCartPageIsOpen();
        await cartPage.proceedToCheckoutButton.click();

        await checkoutPage.assertAddress(checkoutPage.deliveryAddress, createdUser);
        await checkoutPage.assertAddress(checkoutPage.billingAddress, createdUser);

        const randomComment = faker.lorem.sentence();

        await checkoutPage.orderCommentTextArea.fill(randomComment);
        await checkoutPage.placeOrderButton.click();

        await paymentPage.fillPaymentDetails(card);
        await paymentPage.payButton.click();

        await paymentDonePage.assertOrderPlaced();
        await paymentDonePage.continueButton.click();

        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });

    test('user can remove product from cart', { tag: '@TC17' }, async () => {
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

    test('cart keeps searched products after login', { tag: '@TC20' }, async ({ page, createdUser }) => {
        const searchProduct = 'jeans';

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
        for (const name of availableProducts) {
            await expect(cartPage.productRow(name)).toBeVisible();
        }
        await cartPage.loginButton.click();

        await loginPage.loginEmailField.fill(createdUser.email);
        await loginPage.loginPassField.fill(createdUser.password);
        await loginPage.loginButton.click();

        await mainPage.cartButton.click();

        await cartPage.assertCartPageIsOpen();
        await expect(cartPage.cartRows).toHaveCount(availableProducts.length);
        for (const name of availableProducts) {
            await expect(cartPage.productRow(name)).toBeVisible();
        }
    });

    test('user can add recommended item to cart', { tag: '@TC22' }, async ({ page }) => {
        const recomItems = page.locator('#recommended-item-carousel');
        const visibleItems = recomItems.locator('.item.active');

        await expect(page.locator('.recommended_items')).toBeVisible();

        const product = visibleItems.locator('.product-image-wrapper').first();
        const productName = await product.locator('.productinfo p').textContent();

        await visibleItems.getByText('Add to cart').first().click();
        await mainPage.viewCartButton.click();
        await expect(cartPage.productRow(productName!)).toBeVisible();
    });

    test('user can download invoice after placing order', { tag: '@TC24' }, async ({ page }) => {
        const user = createUserData();
        const card = createCardData();

        await mainPage.loginButton.click();

        await loginPage.startSignUp(user.name, user.email);

        await signupPage.fillAccountInformation(user);
        await signupPage.createAccountButton.click();

        await accCreatedPage.assertAccCreatedPageIsVisible();
        await accCreatedPage.contButton.click();

        await expect(mainPage.logginedUserText).toContainText(user.name);
        await mainPage.clickFirstAddToCartButton();
        await mainPage.continueShoppingButton.click();
        await mainPage.cartButton.click();

        await cartPage.assertCartPageIsOpen();
        await cartPage.proceedToCheckoutButton.click();

        await checkoutPage.assertAddress(checkoutPage.deliveryAddress, user);
        await checkoutPage.assertAddress(checkoutPage.billingAddress, user);

        const randomComment = faker.lorem.sentence();
        const totalText = await checkoutPage.totalOrderAmount.textContent();
        const totalAmount = totalText!.replace(/\D/g, '');

        await checkoutPage.orderCommentTextArea.fill(randomComment);
        await checkoutPage.placeOrderButton.click();

        await paymentPage.fillPaymentDetails(card);
        await paymentPage.payButton.click();

        const invoice = page.waitForEvent('download');
        await paymentDonePage.assertOrderPlaced();
        await paymentDonePage.downloadInvoice.click();

        const downloadedDoc = await invoice;
        const filePath = test.info().outputPath('invoice.txt');
        await downloadedDoc.saveAs(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');

        expect(content).toContain(`Hi ${user.firstname} ${user.lastname}, Your total purchase amount is ${totalAmount}. Thank you`);

        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });
});
