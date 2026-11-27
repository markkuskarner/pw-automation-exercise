import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/fixtures';
import { AccDeletedPage } from '@pages/AccDeletedPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';

test.describe('Login', { tag: '@regression' }, () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let accDeletedPage: AccDeletedPage;
    

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        accDeletedPage = new AccDeletedPage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.loginButton.click();


        await expect(loginPage.loginToYourAccText).toBeVisible();
    });

    test('user can log in with correct credentials', { tag: ['@TC2', '@smoke'] }, async ({ createdUser }) => {
        await loginPage.loginIntoAccount(createdUser.email, createdUser.password);

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
    });

    test('user cannot login with incorrect credentials', { tag: '@TC3' }, async ({ page }) => {
        await loginPage.loginIntoAccount(faker.internet.email(), faker.internet.password());

        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('logged-in user can log out', { tag: '@TC4' }, async ({ createdUser }) => {
        await loginPage.loginIntoAccount(createdUser.email, createdUser.password);

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.logoutButton.click();

        await expect(loginPage.loginToYourAccText).toBeVisible();
    });
});
