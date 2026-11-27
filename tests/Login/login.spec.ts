import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/fixtures';

test.describe('Login', { tag: '@regression' }, () => {
    test.beforeEach(async ({ mainPage, loginPage }) => {
        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.loginButton.click();

        await expect(loginPage.loginToYourAccText).toBeVisible();
    });

    test('user can log in with correct credentials', { tag: ['@TC2', '@smoke'] }, async ({ loginPage, mainPage, accDeletedPage, createdUser }) => {
        await loginPage.loginIntoAccount(createdUser.email, createdUser.password);

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
    });

    test('user cannot login with incorrect credentials', { tag: '@TC3' }, async ({ page, loginPage }) => {
        await loginPage.loginIntoAccount(faker.internet.email(), faker.internet.password());

        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('logged-in user can log out', { tag: '@TC4' }, async ({ loginPage, mainPage, createdUser }) => {
        await loginPage.loginIntoAccount(createdUser.email, createdUser.password);

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.logoutButton.click();

        await expect(loginPage.loginToYourAccText).toBeVisible();
    });
});
