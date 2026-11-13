import { Page, Locator, expect } from '@playwright/test';
import { User } from '@data/userFactory';

export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderCommentTextArea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.orderCommentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
  }

  async open() {
    await this.page.goto('/checkout');
  }

  async assertAddress(address: Locator, user: User) {
    await expect(address.locator('.address_firstname')).toHaveText(`Mr. ${user.firstname} ${user.lastname}`);
    await expect(address.locator('.address_city')).toHaveText(`${user.city} ${user.state} ${user.zipcode}`);
    await expect(address.locator('.address_country_name')).toHaveText(user.country);
    await expect(address.locator('.address_phone')).toHaveText(user.mobile_number);
    await expect(address).toContainText(user.company);
    await expect(address).toContainText(user.address1);
    await expect(address).toContainText(user.address2);
  }
}
