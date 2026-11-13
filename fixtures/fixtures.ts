import { test as base, expect } from '@playwright/test';
import { createUserData, User } from '@data/userFactory';

type Fixtures = {
  createdUser: User;
};

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/,
      route => route.abort()
    );
    await use(page);
  },

  createdUser: async ({ request }, use) => {
    const user = createUserData();

    const response = await request.post('/api/createAccount', { form: user });
    const body = await response.json();
    expect(body.responseCode).toBe(201);

    await use(user);

    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  },
});

export { expect };
