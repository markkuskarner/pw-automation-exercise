import { Page, Locator, expect } from '@playwright/test';

export class AccCreatedPage {
  readonly page: Page;
  readonly pageTestId: Locator;
  readonly contButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTestId = page.getByTestId('account-created');
    this.contButton = page.getByTestId('continue-button');
  }

  async open() {
    await this.page.goto('/account_created');
  }

  async assertAccCreatedPageIsVisible() {
    await expect(this.pageTestId).toBeVisible();
  }
}
