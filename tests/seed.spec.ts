import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    const mainPage = new MainPage(page);
    
    await mainPage.open();
    await mainPage.assertHomePageisVisible();
  });
});
