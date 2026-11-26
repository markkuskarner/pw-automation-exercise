# Playwright E2E Tests — Automation Exercise

End-to-end UI and API test automation for [automationexercise.com](https://www.automationexercise.com), a public demo e-commerce site, built with **Playwright** and **TypeScript**.

The scenarios follow the site's official [Test Cases](https://www.automationexercise.com/test_cases) list.

## Tech stack

- [Playwright Test](https://playwright.dev/) — test runner, browser automation, API requests
- TypeScript
- [@faker-js/faker](https://fakerjs.dev/) — random test data
- dotenv — environment configuration
- GitHub Actions — CI

## Approaches used

- **Page Object Model** — locators and page actions live in `pages/`; tests describe scenarios and assertions.
- **Custom fixtures** (`fixtures/fixtures.ts`):
  - `page` is extended to block third-party ad requests via `page.route()`, which keeps tests fast and stable on an ad-heavy site;
  - `createdUser` creates a fresh user through the API before a test and deletes it after the test (even if the test fails), so every test is independent.
- **Test data factories** (`test-data/`) — `createUserData()` and `createCardData()` generate complete, unique data objects for each run.
- **Hybrid UI + API tests** — test preconditions are prepared via API, the scenario itself is checked through the UI.
- **Rule-based assertions instead of hard-coded data** — e.g. search results are checked against the search term, cart rows against prices captured on the products page.
- **Stable locators** — `getByRole`, `getByTestId` (`data-qa` attribute), scoped locators (`row → cell`, `card → button`) to avoid strict-mode collisions.
- Handling of browser dialogs, file uploads, hover-only elements and dynamic URLs.

## Project structure

```
├── fixtures/          # custom fixtures (ad blocking, API-created user)
├── pages/             # page objects
├── test-data/         # data factories (user, payment card)
├── tests/
│   ├── API/           # API tests
│   ├── Cart/          # cart and checkout scenarios
│   ├── ContactUs/
│   ├── Login/
│   ├── Navigation/    # products, search, navigation, subscription
│   └── Register/
├── playwright.config.ts
└── .github/workflows/ # CI
```

## Getting started

Requirements: Node.js 20+.

```bash
npm ci
npx playwright install
cp .env.example .env
```

Run tests:

```bash
npm test               # headless
npm run test:headed    # with a visible browser
npm run test:ui        # Playwright UI mode
npm run report         # open the last HTML report
```

Run a single test case:

```bash
npx playwright test --grep @TC12   # every test is tagged with its test case number
```

## Test coverage

| # | Test case | Type | Spec file |
|---|-----------|------|-----------|
| TC1 | Register user | UI | `Register/register.spec.ts` |
| TC2 | Login with correct email and password | UI + API setup | `Login/login.spec.ts` |
| TC3 | Login with incorrect email and password | UI | `Login/login.spec.ts` |
| TC4 | Logout user | UI + API setup | `Login/login.spec.ts` |
| TC5 | Register with an existing email | UI + API setup | `Register/register.spec.ts` |
| TC6 | Contact Us form (file upload, dialog) | UI | `ContactUs/contact-us.spec.ts` |
| TC7 | Test Cases page | UI | `Navigation/navigation.spec.ts` |
| TC8 | All products and product detail page | UI | `Navigation/navigation.spec.ts` |
| TC9 | Search product | UI | `Navigation/navigation.spec.ts` |
| TC10 | Subscription on home page | UI | `Navigation/navigation.spec.ts` |
| TC11 | Subscription on cart page | UI | `Cart/cart.spec.ts` |
| TC12 | Add products to cart (prices, quantity, totals) | UI | `Cart/cart.spec.ts` |
| TC13 | Product quantity in cart | UI | `Cart/cart.spec.ts` |
| TC14 | Place order: register while checkout | UI | `Cart/cart.spec.ts` |
| TC15 | Place order: register before checkout | UI | `Cart/cart.spec.ts` |
| TC16 | Place order: login before checkout | UI + API setup | `Cart/cart.spec.ts` |
| TC17 | Remove products from cart | UI | `Cart/cart.spec.ts` |
| TC18 | View category products | UI | `Navigation/navigation.spec.ts` |
| TC19 | View and cart brand products | UI | `Navigation/navigation.spec.ts` |
| TC20 | Search products and verify cart after login | UI + API setup | `Cart/cart.spec.ts` |
| TC21 | Add review on product | UI | `Navigation/navigation.spec.ts` |
| TC22 | Add to cart from recommended items | UI | `Cart/cart.spec.ts` |
| TC23 | Verify address details in checkout page | UI | `Navigation/navigation.spec.ts` |
| TC24 | Download invoice after purchase order (file download) | UI | `Cart/cart.spec.ts` |
| TC25 | Scroll up using the arrow button and scroll down | UI | `Navigation/navigation.spec.ts` |
| TC26 | Scroll up without the arrow button and scroll down | UI | `Navigation/navigation.spec.ts` |
| — | Create and delete user | API | `API/api.spec.ts` |

## Notes and known limitations

- The target is a **public demo site** used by many people for practice. It can be slow, and occasionally enables bot protection that blocks automated browsers. Because of that:
  - tests run with a single worker and an increased timeout;
  - CI runs **manually** (`Actions → Playwright Tests → Run workflow`) rather than on every push, to avoid failures caused by the site rather than the tests.
- Ads are blocked at the network level by a fixture; they are third-party content and not part of the tested functionality.
- Tests run with slowMo because the demo site attaches its JavaScript handlers late; this trades a few minutes of run time for stable results.

## Planned improvements

- Shared helper for the repeated checkout flow (TC14, TC15, TC16, TC24)
- Shared components for repeated page parts (header, footer, product cards)
- Login via saved session state (`storageState`) for tests that don't verify login itself
- Tags (`@smoke`, `@regression`) for selective runs
