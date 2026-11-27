import { test as base, expect } from '@playwright/test';
import { createUserData, User } from '@data/userFactory';
import { MainPage } from '@pages/MainPage';
import { LoginPage } from '@pages/LoginPage';
import { SignUpPage } from '@pages/SignupPage';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { PaymentDonePage } from '@pages/PaymentDonePage';

type Fixtures = {
  createdUser: User;
  mainPage: MainPage;
  loginPage: LoginPage;
  signUpPage: SignUpPage;
  accCreatedPage: AccCreatedPage;
  accDeletedPage: AccDeletedPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  paymentDonePage: PaymentDonePage;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/,
      route => route.abort()
    );
    await use(page);
  },

  createdUser: async ({ request }, use) => {
    const user = createUserData();

    const response = await request.post('/api/createAccount', { form: user });
    const body = await response.json();
    expect(body.responseCode).toBe(201);

    await use(user);

    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  },
  mainPage: async ({ page }, use) => { await use(new MainPage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  signUpPage: async ({ page }, use) => { await use(new SignUpPage(page)); },
  accCreatedPage: async ({ page }, use) => { await use(new AccCreatedPage(page)); },
  accDeletedPage: async ({ page }, use) => { await use(new AccDeletedPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  productDetailsPage: async ({ page }, use) => { await use(new ProductDetailsPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  paymentPage: async ({ page }, use) => { await use(new PaymentPage(page)); },
  paymentDonePage: async ({ page }, use) => { await use(new PaymentDonePage(page)); },
});

export { expect };
