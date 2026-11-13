import { test, expect } from '@fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { MainPage } from '@pages/MainPage';
import { LoginPage } from '@pages/LoginPage';

test('login user with incorrect email and password', async ({ page }) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.loginButton.click();

    await expect(loginPage.loginToYourAccText).toBeVisible();
    await loginPage.loginEmailField.fill(faker.internet.email());
    await loginPage.loginPassField.fill(faker.internet.password());
    await loginPage.loginButton.click();

    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});
