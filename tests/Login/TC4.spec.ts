import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { LoginPage } from '@pages/LoginPage';

test('logout user', async ({ page, createdUser }) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.loginButton.click();

    await expect(loginPage.loginToYourAccText).toBeVisible();
    await loginPage.loginEmailField.fill(createdUser.email);
    await loginPage.loginPassField.fill(createdUser.password);
    await loginPage.loginButton.click();

    await expect(mainPage.logginedUserText).toContainText(createdUser.name);
    await mainPage.logoutButton.click();

    await expect(loginPage.loginToYourAccText).toBeVisible();
});
