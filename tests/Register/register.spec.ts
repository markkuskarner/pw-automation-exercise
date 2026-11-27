import { test, expect } from '@fixtures/fixtures';
import { createUserData } from '@data/userFactory';

test.describe('Register', { tag: '@regression' }, () => {
    test.beforeEach(async ({ mainPage, loginPage }) => {
        await mainPage.open();
        await mainPage.assertHomePageisVisible();
        await mainPage.loginButton.click();

        await expect(loginPage.newUserSignupText).toBeVisible();
    });

    test('user can register a new account', { tag: ['@TC1', '@smoke'] }, async ({ loginPage, signUpPage, accCreatedPage, mainPage, accDeletedPage }) => {
        const user = createUserData();

        await loginPage.startSignUp(user.name, user.email);

        await expect(signUpPage.entrAccInfoText).toBeVisible();
        await signUpPage.fillAccountInformation(user);
        await signUpPage.createAccountButton.click();

        await accCreatedPage.assertAccCreatedPageIsVisible();
        await accCreatedPage.contButton.click();
        await expect(mainPage.logginedUserText).toContainText(user.name);

        await mainPage.deleteButton.click();
        await accDeletedPage.assertAccDeletedPageIsVisible();
        await accDeletedPage.contButton.click();
    });

    test('user cannot register with an already registered email', { tag: '@TC5' }, async ({ page, loginPage, createdUser }) => {
        await loginPage.startSignUp(createdUser.name, createdUser.email);

        await expect(page.getByText('Email Address already exist!')).toBeVisible();
    });
});
