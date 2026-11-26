# TC25 — Verify Scroll Up using 'Arrow' button and Scroll Down functionality

## Application Overview

Home page of [automationexercise.com](https://www.automationexercise.com). The page is long (~7,600 px of
scroll height). A fixed "scroll up" arrow (`<a id="scrollUp" href="#top">` with a `fa-angle-up` icon) sits
in the bottom-right corner. It is hidden (`display: none`) while the page is at the top, appears once the
user scrolls down, and on click animates the page back to the top (~0.5 s), after which it is hidden again.

The hero area is a Bootstrap carousel (`#slider-carousel`) with **3 slides**, each containing an `h2`
"Full-Fledged practice website for Automation Engineers". Only the active slide is visible, so locators for
this heading must target the visible one (e.g. `.filter({ visible: true })` or scope to `.item.active`),
otherwise strict mode fails.

## Seed / Setup

- **Seed file:** `tests/seed.spec.ts`
- **Fixtures:** `@fixtures/fixtures` (blocks ad network requests — important here, ad iframes can overlap the arrow)
- **Page object:** `MainPage` (`open()`, `assertHomePageisVisible()`, `subscriptionText`)
- **Suggested spec file:** `tests/Navigation/TC25.spec.ts`
- **Preconditions:** none (no login, no test data)

## Suggested additions to `MainPage`

| Member | Locator | Note |
|---|---|---|
| `scrollUpArrow` | `page.locator('#scrollUp')` | No accessible name — id is the most stable hook |
| `heroHeading` | `page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).filter({ visible: true })` | 3 copies in the carousel |
| `subscriptionHeading` | `page.getByRole('heading', { name: 'Subscription' })` | Stricter than the existing `getByText('Subscription')` |

## Test Scenarios

### 1. Scroll up using the arrow button (happy path — official TC25)

**Steps**

1. Open the home page (`mainPage.open()`).
2. Verify the home page is visible (`assertHomePageisVisible()` — "Features Items" heading).
3. Scroll down to the bottom of the page — e.g. `subscriptionHeading.scrollIntoViewIfNeeded()`
   or `page.keyboard.press('End')`.
4. Verify the "SUBSCRIPTION" heading in the footer is visible in the viewport.
5. Click the arrow at the bottom-right (`scrollUpArrow.click()`).
6. Verify the page has scrolled to the top and "Full-Fledged practice website for Automation Engineers"
   is visible.

**Expected results**

- Step 2: "Features Items" heading visible; URL is `/`.
- Step 4: `expect(subscriptionHeading).toBeInViewport()`; `expect(scrollUpArrow).toBeVisible()`.
- Step 6: `expect(heroHeading).toBeInViewport()`; `expect(subscriptionHeading).not.toBeInViewport()`;
  `window.scrollY` polls to `0` (`expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)`).

**Notes**

- Use `toBeInViewport()`, not just `toBeVisible()`. `toBeVisible()` passes for elements that are scrolled
  off-screen, so it would not actually prove the scroll happened — this is the main trap in this TC.
- The scroll-up is animated; rely on auto-retrying assertions / `expect.poll`, never `waitForTimeout`.

### 2. Scroll-up arrow visibility toggles with scroll position

**Steps**

1. Open the home page.
2. Verify the arrow is hidden at the top of the page.
3. Scroll to the bottom.
4. Verify the arrow becomes visible.
5. Click the arrow and wait for the page to reach the top.
6. Verify the arrow is hidden again.

**Expected results**

- Step 2 and 6: `expect(scrollUpArrow).toBeHidden()`.
- Step 4: `expect(scrollUpArrow).toBeVisible()`.

### 3. URL does not change after clicking the arrow (negative / side-effect check)

**Steps**

1. Open the home page, scroll to the bottom, click the arrow.

**Expected results**

- No navigation happens; URL stays on the home page (the plugin intercepts `href="#top"`, so at most a
  `#top` fragment may appear — assert with a regex like `/\/(#top)?$/`).
- No additional page load (header and products are not re-requested).

### 4. Arrow works after a partial scroll (edge case)

**Steps**

1. Open the home page.
2. Scroll partway down with the mouse wheel (`page.mouse.wheel(0, 3000)`).
   (Scrolling to the "recommended items" heading is flaky: lazy-loaded content shifts it out of view.)
3. Verify neither the hero nor the footer is in the viewport, the arrow is visible, and click it.

**Expected results**

- `heroHeading` is in viewport and `window.scrollY` returns to `0`.

## Out of scope

- TC26 (scroll up *without* the arrow) — separate plan/spec.
- Visual/pixel checks of the arrow icon.
- Mobile viewports (the arrow plugin behaves the same, but layout is not covered here).
