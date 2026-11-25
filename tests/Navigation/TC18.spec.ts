import { test, expect } from '@fixtures/fixtures';
import { MainPage } from '@pages/MainPage';

test('view category products', async ({ page }) => {
    const mainPage = new MainPage(page);

    await mainPage.open();
    await mainPage.assertHomePageisVisible();
    const categories = page.locator('#accordian');
    const womanCategory = categories.locator('a[href="#Women"]');
    const manCategory = categories.locator('a[href="#Men"]');
    const womenCategoryList = categories.locator('#Women')
    const manCategoryList = categories.locator('#Men')

    await expect(categories).toBeVisible();
    await womanCategory.click();
    await womenCategoryList.getByRole('link', { name: 'Dress' }).click();
    await expect(page.getByText('Women - Dress Products')).toBeVisible();
    await manCategory.click();
    await manCategoryList.getByRole('link', {name : 'Jeans'}).click();
    await expect(page.getByText('Men - Jeans Products')).toBeVisible();
    

});
