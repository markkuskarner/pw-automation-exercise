import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { SignUpPage } from '@pages/SignupPage';
import { createUserData } from '@data/userFactory';
import { createCardData } from '@data/cardFactory';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { faker } from '@faker-js/faker';
import { PaymentPage } from '@pages/PaymentPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';
import * as fs from 'fs';


test('download invoice after purchase order', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignUpPage(page);
    const accCreatedPage = new AccCreatedPage(page);
    const accDeletedPage = new AccDeletedPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const paymentDonePage = new PaymentDonePage(page);
    const user = createUserData();
    const card = createCardData();

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
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

    expect(content).toContain(`Hi ${user.firstname} ${user.lastname}, Your1 total purchase amount is ${totalAmount}. Thank you`)

    await mainPage.deleteButton.click();
    await accDeletedPage.assertAccDeletedPageIsVisible();
    await accDeletedPage.contButton.click();
});