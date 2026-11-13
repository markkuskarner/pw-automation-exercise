import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { LoginPage } from '@pages/LoginPage';

test('register user with already registered email', async ({ page, createdUser }) => {
    const mainPage = new MainPage(page);
    const loginPage = new LoginPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.loginButton.click();

    await expect(loginPage.newUserSignupText).toBeVisible();
    await loginPage.signUpEmailField.fill(createdUser.email);
    await loginPage.signUpNameField.fill(createdUser.name);
    await loginPage.signUpButton.click();

    await expect(page.getByText('Email Address already exist!')).toBeVisible();
});
