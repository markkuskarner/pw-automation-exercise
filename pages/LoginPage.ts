import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly newUserSignupText: Locator;
  readonly loginToYourAccText: Locator;
  readonly signUpNameField: Locator;
  readonly signUpEmailField: Locator;
  readonly signUpButton: Locator;
  readonly loginEmailField: Locator;
  readonly loginPassField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newUserSignupText = page.getByRole('heading', {name : 'New User Signup!'});
    this.loginToYourAccText = page.getByRole('heading', {name : 'Login to your account'});
    this.signUpNameField = page.getByTestId('signup-name');
    this.signUpEmailField = page.getByTestId('signup-email');
    this.signUpButton = page.getByTestId('signup-button');
    this.loginEmailField = page.getByTestId('login-email');
    this.loginPassField = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');
  }

  async open() {
    await this.page.goto('/login');
  }

  async waitForLoginPage() {
    await this.page.waitForURL('/login')
  }

  async startSignUp(name: string, email: string) {
    await this.signUpNameField.fill(name);
    await this.signUpEmailField.fill(email);
    await this.signUpButton.click();
  }

  async loginIntoAccount(email: string, password: string) {
    await this.loginEmailField.fill(email);
    await this.loginPassField.fill(password);
    await this.loginButton.click();
  }
}
