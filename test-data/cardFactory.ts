import { faker } from '@faker-js/faker';

export type Card = {
  nameOnCard: string;
  number: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export function createCardData(): Card {
  const expiry = faker.date.future({ years: 3 });

  return {
    nameOnCard: faker.person.fullName(),
    number: faker.finance.creditCardNumber(),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: String(expiry.getMonth() + 1).padStart(2, '0'),
    expiryYear: String(expiry.getFullYear()),
  };
}
