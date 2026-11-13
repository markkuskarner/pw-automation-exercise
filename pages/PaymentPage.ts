import { Page, Locator } from '@playwright/test';
import { Card } from '@data/cardFactory';

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardField: Locator
  readonly cardNumberField: Locator
  readonly cvcField: Locator;
  readonly expirationMonthField: Locator;
  readonly expirationYearField: Locator;
  readonly payButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardField = page.getByTestId('name-on-card');
    this.cardNumberField = page.getByTestId('card-number');
    this.cvcField = page.getByTestId('cvc');
    this.expirationMonthField = page.getByTestId('expiry-month');
    this.expirationYearField = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');
  }

  async open() {
    await this.page.goto('/payment');
  }

  async fillPaymentDetails(card: Card) {
    await this.nameOnCardField.fill(card.nameOnCard);
    await this.cardNumberField.fill(card.number);
    await this.cvcField.fill(card.cvc);
    await this.expirationMonthField.fill(card.expiryMonth);
    await this.expirationYearField.fill(card.expiryYear);
  }
}
