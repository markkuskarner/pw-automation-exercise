import { faker } from '@faker-js/faker';
import { createUserData } from '@data/userFactory';
import { test, expect } from '@fixtures/fixtures';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { ProductsPage } from '@pages/ProductsPage';
import { SignUpPage } from '@pages/SignupPage';

test.describe('Navigation', { tag: '@regression' }, () => {
    let mainPage: MainPage;
    let productsPage: ProductsPage;
    let productDetailsPage: ProductDetailsPage;
    let loginPage: LoginPage;
    let signupPage: SignUpPage;
    let accCreatedPage: AccCreatedPage;
    let accDeletedPage: AccDeletedPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        loginPage = new LoginPage(page);
        signupPage = new SignUpPage(page);
        accCreatedPage = new AccCreatedPage(page);
        accDeletedPage = new AccDeletedPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
    });

    test('user can open Test Cases page', { tag: '@TC7' }, async ({ page }) => {
        await mainPage.testcasesButton.click();
        await expect(page.getByText('Below is the list of test Cases for you to practice the Automation. Click on the scenario for detailed Test Steps:'))
            .toBeVisible();
    });

    test('user can view all products and product details', { tag: ['@TC8', '@smoke'] }, async ({ page }) => {
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

    test('search returns only matching products', { tag: ['@TC9', '@smoke'] }, async ({ page }) => {
        const searchProduct = 'jeans';

        await mainPage.productsButton.click();
        await productsPage.assertProductsPageIsOpen();

        await productsPage.searchField.fill(searchProduct);
        await productsPage.searchButton.click();
        await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

        const resultNames = page.locator('.productinfo p');
        await expect(resultNames.first()).toBeVisible();

        for (const name of await resultNames.all()) {
            await expect(name).toContainText(searchProduct, { ignoreCase: true });
        }
    });

    test('user can subscribe from home page', { tag: '@TC10' }, async ({ page }) => {
        await expect(mainPage.subscriptionText).toBeVisible();
        await mainPage.subEmailField.fill(faker.internet.email());
        await mainPage.subEmailButton.click();
        await expect(page.getByText('You have been successfully')).toBeVisible();
    });

    test('user can view products by category', { tag: '@TC18' }, async ({ page }) => {
        const categories = page.locator('#accordian');
        const womanCategory = categories.locator('a[href="#Women"]');
        const manCategory = categories.locator('a[href="#Men"]');
        const womenCategoryList = categories.locator('#Women');
        const manCategoryList = categories.locator('#Men');

        await expect(categories).toBeVisible();
        await womanCategory.click();
        await womenCategoryList.getByRole('link', { name: 'Dress' }).click();
        await expect(page.getByText('Women - Dress Products')).toBeVisible();
        await manCategory.click();
        await manCategoryList.getByRole('link', { name: 'Jeans' }).click();
        await expect(page.getByText('Men - Jeans Products')).toBeVisible();
    });

    test('user can view products by brand', { tag: '@TC19' }, async ({ page }) => {
        const brands = page.locator('.brands_products');

        await mainPage.productsButton.click();
        await expect(brands).toBeVisible();
        await brands.getByRole('link', { name: 'Polo' }).click();
        await expect(page.getByText('Brand - Polo Products')).toBeVisible();
        await brands.getByRole('link', { name: 'Biba' }).click();
        await expect(page.getByText('Brand - Biba Products')).toBeVisible();
    });

    test('user can add a review on product', { tag: '@TC21' }, async ({ page }) => {
        await mainPage.productsButton.click();
        await productsPage.assertProductsPageIsOpen();
        await productsPage.firstViewProductButton.click();
        await productDetailsPage.yourNameTextField.fill(faker.person.fullName());
        await productDetailsPage.yourEmailTextField.fill(faker.internet.email());
        await productDetailsPage.yourReviewTextField.fill(faker.lorem.paragraph());
        await productDetailsPage.submitReviewButton.click();
        await expect(page.getByText('Thank you for your review.')).toBeVisible();
    });

    test('checkout shows the address entered at registration', { tag: '@TC23' }, async () => {
        const user = createUserData();

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
        await checkoutPage.deleteButton.click();

        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });

    test('user can scroll up using the arrow button', { tag: '@TC25' }, async ({ page }) => {
        await expect(mainPage.scrollUpArrow).toBeHidden();

        await page.mouse.wheel(0, 3000);
        await expect.poll(() => mainPage.scrollY()).toBeGreaterThan(0);
        await expect(mainPage.heroHeading).not.toBeInViewport();
        await expect(mainPage.scrollUpArrow).toBeVisible();

        await mainPage.scrollToBottom();
        await expect(mainPage.subscriptionHeading).toBeInViewport();
        await expect(mainPage.scrollUpArrow).toBeVisible();

        await mainPage.scrollUpArrow.click();

        await mainPage.assertScrolledToTop();
        await expect(mainPage.subscriptionHeading).not.toBeInViewport();
        await expect(mainPage.scrollUpArrow).toBeHidden();
        await expect(page).toHaveURL(/automationexercise\.com\/(#top)?$/);
    });

    test('user can scroll up without the arrow button', { tag: '@TC26' }, async ({ page }) => {
        await mainPage.scrollToBottom();
        await expect(mainPage.subscriptionHeading).toBeInViewport();
        await expect(mainPage.heroHeading).not.toBeInViewport();

        const pageHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.mouse.wheel(0, -pageHeight);

        await mainPage.assertScrolledToTop();
        await expect(mainPage.subscriptionHeading).not.toBeInViewport();
    });
});
