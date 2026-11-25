import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly quantityField: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartButton: Locator;
  readonly productName: Locator;
  readonly productInformation: Locator;
  readonly yourNameTextField: Locator
  readonly yourEmailTextField: Locator
  readonly yourReviewTextField: Locator
  readonly submitReviewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quantityField = page.locator('#quantity');
    this.addToCartButton = page.getByText('Add to cart')
    this.viewCartButton = page.getByRole('link', { name: 'View Cart' });
    this.productInformation = page.locator('.product-information');
    this.productName = this.productInformation.locator('h2');
    this.yourNameTextField = page.getByPlaceholder("Your Name");
    this.yourEmailTextField = page.getByRole('textbox', { name: 'Email Address', exact: true })
    this.yourReviewTextField = page.getByPlaceholder("Add Review Here!");
    this.submitReviewButton = page.locator('#button-review');
  }

  async assertProductDetailedPageIsVisible() {
    await expect(this.page.getByText('Write Your Review')).toBeVisible();
  }

  async clickAddToCartButton() {
    await this.addToCartButton.click();
  }

  async clickViewCartButton() {
    await this.viewCartButton.click();
  }
}
