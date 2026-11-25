import { Page, Locator, expect } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly pageVisabilityLocator: Locator;
  readonly logginedUserText: Locator;
  readonly deleteButton: Locator;
  readonly logoutButton: Locator;
  readonly contactusButton: Locator;
  readonly testcasesButton: Locator;
  readonly productsButton: Locator;
  readonly subscriptionText: Locator;
  readonly subEmailField: Locator;
  readonly subEmailButton: Locator;
  readonly cartButton: Locator;
  readonly viewProductButton: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('link', {name: 'Signup / Login'})
    this.pageVisabilityLocator = page.getByRole('heading', { name: 'Features Items' });
    this.logginedUserText = page.getByText('Logged in as');
    this.deleteButton = page.getByRole('link', { name: 'Delete Account' });
    this.logoutButton = page.getByRole('link', { name: ' Logout' });
    this.contactusButton = page.getByRole('link', { name: 'Contact us' });
    this.testcasesButton = page.getByRole('link', { name: ' Test Cases' });
    this.productsButton = page.getByRole('link', {name : ' Products'});
    this.cartButton = page.locator('#header').getByRole('link', { name: 'Cart' });
    this.subscriptionText = page.getByText('Subscription');
    this.subEmailField = page.getByPlaceholder('Your email address');
    this.subEmailButton = page.locator('#subscribe');
    this.viewProductButton = page.getByRole('link', { name: 'View Product' });
    this.addToCartButton = page.getByText('Add to cart');
    this.viewCartButton = page.getByRole('link', { name: 'View Cart' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: 'Features Items' })).toBeVisible({ timeout: 30_000 });
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async assertHomePageisVisible(){
    await expect(this.pageVisabilityLocator).toBeVisible();
  }

  async clickFirstViewProductButton() {
    await this.viewProductButton.first().click();
  }

  async clickFirstAddToCartButton(){
    await this.addToCartButton.first().click();
    await expect(this.page.getByText('Your product has been added to cart.')).toBeVisible();
  }

  async clickViewCartButton() {
    await this.viewCartButton.click();
  }
}
