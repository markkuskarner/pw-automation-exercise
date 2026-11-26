import { test, expect } from '@fixtures/fixtures';
import { createUserData } from '@data/userFactory';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { LoginPage } from '@pages/LoginPage';
import { MainPage } from '@pages/MainPage';
import { SignUpPage } from '@pages/SignupPage';

test.describe('Register', () => {
    let mainPage: MainPage;
    let loginPage: LoginPage;
    let signUpPage: SignUpPage;
    let accCreatedPage: AccCreatedPage;

    test.beforeEach(async ({ page }) => {
        mainPage = new MainPage(page);
        loginPage = new LoginPage(page);
        signUpPage = new SignUpPage(page);
        accCreatedPage = new AccCreatedPage(page);

        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.loginButton.click();

        await expect(loginPage.newUserSignupText).toBeVisible();
    });

    test('user can register a new account', { tag: '@TC1' }, async ({ page }) => {
        const user = createUserData();

        await loginPage.startSignUp(user.name, user.email);

        await expect(signUpPage.entrAccInfoText).toBeVisible();
        await signUpPage.fillAccountInformation(user);
        await signUpPage.createAccountButton.click();

        await accCreatedPage.assertAccCreatedPageIsVisible();
        await accCreatedPage.contButton.click();
        await expect(mainPage.logginedUserText).toContainText(user.name);

        await mainPage.deleteButton.click();
        await expect(page.getByTestId('account-deleted')).toBeVisible();
        await page.getByTestId('continue-button').click();
    });

    test('user cannot register with an already registered email', { tag: '@TC5' }, async ({ page, createdUser }) => {
        await loginPage.signUpEmailField.fill(createdUser.email);
        await loginPage.signUpNameField.fill(createdUser.name);
        await loginPage.signUpButton.click();

        await expect(page.getByText('Email Address already exist!')).toBeVisible();
    });
});
