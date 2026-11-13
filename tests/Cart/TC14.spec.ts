import { test, expect } from '@fixtures/fixtures';
import { CartPage } from '@pages/CartPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { SignUpPage } from '@pages/SignupPage';
import { createUserData } from '@data/userFactory';
import { createCardData } from '@data/cardFactory';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { faker } from '@faker-js/faker';
import { PaymentPage } from '@pages/PaymentPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';

test('place order: register while checkout', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignUpPage(page);
    const accCreatedPage = new AccCreatedPage(page);
    const checkoutPage = new CheckoutPage(page);
    const paymentPage = new PaymentPage(page);
    const paymentDonePage = new PaymentDonePage(page);
    const user = createUserData();
    const card = createCardData();

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
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
    await expect(page.getByTestId('account-deleted')).toBeVisible();
    await page.getByTestId('continue-button').click();
});
