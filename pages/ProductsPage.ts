import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly allProductsText: Locator;
  readonly productList: Locator;
  readonly firstProduct: Locator;
  readonly secondProduct: Locator;
  readonly firstProductName: Locator;
  readonly secondProductName: Locator;
  readonly firstProductPrice: Locator;
  readonly secondProductPrice: Locator;
  readonly firstViewProductButton: Locator;
  readonly searchField: Locator;
  readonly searchButton: Locator;
  readonly contShoppingButton: Locator;
  readonly viewCartButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.allProductsText = page.getByText('All Products');
    this.productList = page.locator('.product-image-wrapper');
    this.firstProduct = page.locator('.product-image-wrapper').first();
    this.secondProduct = page.locator('.product-image-wrapper').nth(1);
    this.firstProductName = this.firstProduct.locator('.productinfo p');
    this.secondProductName = this.secondProduct.locator('.productinfo p');
    this.firstViewProductButton = this.firstProduct.getByRole('link', { name: 'View Product' });
    this.searchField = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.contShoppingButton = page.getByRole('button', {name : 'Continue Shopping'});
    this.viewCartButton = page.getByRole('link', { name: 'View Cart' });
    this.firstProductPrice = this.firstProduct.locator('.productinfo h2');
    this.secondProductPrice = this.secondProduct.locator('.productinfo h2');
  }

  async open() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async assertProductsPageIsOpen() {
    await expect(this.allProductsText).toBeVisible();
  }

  async clickContinueShoppingButton() {
    await this.contShoppingButton.click();
  }

  async addToCart(product: Locator) {
    await product.hover();
    await product.locator('.product-overlay').getByText('Add to cart').click();
  }
}
