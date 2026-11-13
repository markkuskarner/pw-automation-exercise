import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';

test('verify "Test Cases" page', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    await mainPage.testcasesButton.click();
    await expect(page.getByText('Below is the list of test Cases for you to practice the Automation. Click on the scenario for detailed Test Steps:'))
        .toBeVisible();
});
