import { Page, Locator, expect } from '@playwright/test';

export class PaymentDonePage {
  readonly page: Page;
  readonly orderPlacedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderPlacedHeading = page.getByTestId('order-placed');
    this.continueButton = page.getByTestId('continue-button');
  }

  async assertOrderPlaced() {
    await expect(this.page).toHaveURL(/payment_done\/\d+/);
    await expect(this.orderPlacedHeading).toBeVisible();
  }
}
