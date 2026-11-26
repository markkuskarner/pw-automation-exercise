import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/fixtures';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';

test.describe('Login', () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.loginButton.click();

        await expect(loginPage.loginToYourAccText).toBeVisible();
    });

    test('user can log in with correct credentials', { tag: '@TC2' }, async ({ page, createdUser }) => {
        await loginPage.loginEmailField.fill(createdUser.email);
        await loginPage.loginPassField.fill(createdUser.password);
        await loginPage.loginButton.click();

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.deleteButton.click();
        await expect(page.getByTestId('account-deleted')).toBeVisible();
    });

    test('user cannot log in with incorrect credentials', { tag: '@TC3' }, async ({ page }) => {
        await loginPage.loginEmailField.fill(faker.internet.email());
        await loginPage.loginPassField.fill(faker.internet.password());
        await loginPage.loginButton.click();

        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('logged-in user can log out', { tag: '@TC4' }, async ({ createdUser }) => {
        await loginPage.loginEmailField.fill(createdUser.email);
        await loginPage.loginPassField.fill(createdUser.password);
        await loginPage.loginButton.click();

        await expect(mainPage.logginedUserText).toContainText(createdUser.name);
        await mainPage.logoutButton.click();

        await expect(loginPage.loginToYourAccText).toBeVisible();
    });
});
