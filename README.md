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
npx playwright test TC12
```

## Test coverage

| # | Test case | Type |
|---|-----------|------|
| TC1 | Register user | UI |
| TC2 | Login with correct email and password | UI + API setup |
| TC3 | Login with incorrect email and password | UI |
| TC4 | Logout user | UI + API setup |
| TC5 | Register with an existing email | UI + API setup |
| TC6 | Contact Us form (file upload, dialog) | UI |
| TC7 | Test Cases page | UI |
| TC8 | All products and product detail page | UI |
| TC9 | Search product | UI |
| TC10 | Subscription on home page | UI |
| TC11 | Subscription on cart page | UI |
| TC12 | Add products to cart (prices, quantity, totals) | UI |
| TC13 | Product quantity in cart | UI |
| TC14 | Place order: register while checkout | UI |
| — | Create and delete user | API |

## Notes and known limitations

- The target is a **public demo site** used by many people for practice. It can be slow, and occasionally enables bot protection that blocks automated browsers. Because of that:
  - tests run with a single worker and an increased timeout;
  - CI runs **manually** (`Actions → Playwright Tests → Run workflow`) rather than on every push, to avoid failures caused by the site rather than the tests.
- Ads are blocked at the network level by a fixture; they are third-party content and not part of the tested functionality.
- Tests run with slowMo because the demo site attaches its JavaScript handlers late; this trades a few minutes of run time for stable results.

## Planned improvements

- Remaining test cases from the site's list (TC15–TC26)
- Shared components for repeated page parts (header, footer, product cards)
- Login via saved session state (`storageState`) for tests that don't verify login itself
- Tags (`@smoke`, `@regression`) for selective runs
