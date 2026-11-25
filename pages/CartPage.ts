import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly subscriptionText: Locator;
  readonly subEmailField: Locator;
  readonly subEmailButton: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly breadcrumbs: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly regLogButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subscriptionText = page.getByText('Subscription');
    this.subEmailField = page.getByPlaceholder('Your email address');
    this.subEmailButton = page.locator('#subscribe');
    this.cartTable = page.locator('#cart_info_table');
    this.cartRows = this.cartTable.locator('tbody tr');
    this.breadcrumbs = page.locator('.breadcrumbs');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.regLogButton = page.getByRole('link', {name: 'Register / Login'});
    this.loginButton = page.getByRole('link', {name: 'Signup / Login'})
  }

  async open() {
    await this.page.goto('/view_cart');
  }

  productRow(name: string) {
    return this.cartRows.filter({ hasText: name });
  }

  async assertCartPageIsOpen() {
  await expect(this.page).toHaveURL(/view_cart/);
  await this.page.waitForLoadState('load');
  await expect(this.breadcrumbs).toContainText('Shopping Cart');
  }
}
