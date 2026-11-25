import { createUserData } from '@data/userFactory';
import { test, expect } from '@fixtures/fixtures';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { SignUpPage } from '@pages/SignupPage';

test('verify address details in checkout page', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new SignUpPage(page);
    const accCreatedPage = new AccCreatedPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const accDeletedPage = new AccDeletedPage(page);
    const user = createUserData();
    
    

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
    await checkoutPage.deleteButton.click();

    await accDeletedPage.assertAccDeletedPageIsVisible();
    await accDeletedPage.contButton.click();  
});
