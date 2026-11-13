import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';
import { LoginPage } from '@pages/LoginPage';
import { SignUpPage } from '@pages/SignupPage';
import { AccCreatedPage } from '@pages/AccCreatedPage';
import { createUserData } from '@data/userFactory';

test('Register user', async ({ page }) => {
  const mainPage = new MainPage(page);
  const loginPage = new LoginPage(page);
  const signUpPage = new SignUpPage(page);
  const accCreatedPage = new AccCreatedPage(page);
  const user = createUserData();

  await mainPage.open();
  await mainPage.assertHomePageisVisible();
  await mainPage.clickLoginButton();

  await expect(loginPage.newUserSignupText).toBeVisible();
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
