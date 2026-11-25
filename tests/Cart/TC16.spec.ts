import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { createCardData } from '@data/cardFactory';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { faker } from '@faker-js/faker';
import { PaymentPage } from '@pages/PaymentPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';

test('place order: login before checkout', async ({ page, createdUser }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const accDeletedPage = new AccDeletedPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const paymentDonePage = new PaymentDonePage(page);
    const card = createCardData();

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
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


