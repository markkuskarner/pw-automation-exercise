import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';

test.describe('Contact Us', { tag: '@regression' }, () => {
    let mainPage: MainPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.contactusButton.click();
        await page.waitForLoadState('load');
        await expect(page.getByText('Get In Touch')).toBeVisible();
    });

    test('user can submit contact form with an attached file', { tag: '@TC6' }, async ({ page }) => {
        await page.getByTestId('name').fill(faker.person.firstName());
        await page.getByTestId('email').fill(faker.internet.email());
        await page.getByTestId('subject').fill(faker.lorem.sentence());
        await page.getByTestId('message').fill(faker.lorem.paragraphs());
        await page.locator('input[type="file"]').setInputFiles({
            name: 'sample.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from(faker.lorem.paragraph()),
        });

        page.once('dialog', dialog => dialog.accept());
        await page.getByTestId('submit-button').click();
        await expect(page.locator('#contact-page')
            .getByText('Success! Your details have been submitted successfully.')).toBeVisible();

        await page.getByRole('link', { name: 'Home'}).nth(1).click();
        await mainPage.assertHomePageisVisible();
    });
});
