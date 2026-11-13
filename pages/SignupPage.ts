import { Page, Locator, expect } from '@playwright/test';
import { User } from '@data/userFactory';

export class SignUpPage {
  readonly page: Page;
  readonly entrAccInfoText: Locator;
  readonly title: Locator;
  readonly password: Locator;
  readonly DOBdaySelect: Locator;
  readonly DOBmonthSelect: Locator;
  readonly DOByearSelect: Locator;
  readonly newsLetterSubButton: Locator;
  readonly specOfferSubButton: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly companyField: Locator;
  readonly addressField: Locator;
  readonly address2Field: Locator;
  readonly countryDropDown: Locator;
  readonly stateField: Locator;
  readonly cityField: Locator;
  readonly zipCodeField: Locator;
  readonly mobNumberField: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.entrAccInfoText = page.getByRole('heading', { name: 'Enter Account Information'});
    this.title = page.getByTestId('title');
    this.password = page.getByTestId('password');
    this.DOBdaySelect = page.getByTestId('days');
    this.DOBmonthSelect = page.getByTestId('months');
    this.DOByearSelect = page.getByTestId('years');
    this.newsLetterSubButton = page.getByRole('checkbox', {name: 'newsletter'});
    this.specOfferSubButton = page.getByRole('checkbox', {name : 'Receive special offers from our partners!'});
    this.firstNameField = page.getByTestId('first_name');
    this.lastNameField = page.getByTestId('last_name');
    this.companyField = page.getByTestId('company');
    this.addressField = page.getByTestId('address');
    this.address2Field = page.getByTestId('address2');
    this.countryDropDown = page.getByTestId('country');
    this.stateField = page.getByTestId('state');
    this.cityField = page.getByTestId('city');
    this.zipCodeField = page.getByTestId('zipcode');
    this.mobNumberField = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  async open() {
    await this.page.goto('/signup');
  }

  private async selectRandomOption(select: Locator): Promise<string> {
    const count = await select.locator('option').count();
    const index = Math.floor(Math.random() * (count - 1)) + 1;
    const [selected] = await select.selectOption({ index });
    return selected;
  }
  async selectRandomDateOfBirth() {
    const day = await this.selectRandomOption(this.DOBdaySelect);
    const month = await this.selectRandomOption(this.DOBmonthSelect);
    const year = await this.selectRandomOption(this.DOByearSelect);
    return { day, month, year };
  }

  async selectRandomCountry() {
    const country = await this.selectRandomOption(this.countryDropDown);
    return { country };
  }

  async fillAccountInformation(user: User) {
    await this.page.getByRole('radio', { name: 'Mr.', exact: true }).check();
    await this.password.fill(user.password);

    await this.DOBdaySelect.selectOption(user.birth_date);
    await this.DOBmonthSelect.selectOption(user.birth_month);
    await this.DOByearSelect.selectOption(user.birth_year);

    await this.newsLetterSubButton.check();
    await this.specOfferSubButton.check();

    await this.firstNameField.fill(user.firstname);
    await this.lastNameField.fill(user.lastname);
    await this.companyField.fill(user.company);
    await this.addressField.fill(user.address1);
    await this.address2Field.fill(user.address2);
    await this.countryDropDown.selectOption(user.country);
    await this.stateField.fill(user.state);
    await this.cityField.fill(user.city);
    await this.zipCodeField.fill(user.zipcode);
    await this.mobNumberField.fill(user.mobile_number);
  }
}
