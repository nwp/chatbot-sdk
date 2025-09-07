import { expect, test } from '../fixtures';

test.describe('Unauthenticated Session', () => {
  test('Redirect to /sign-in when visiting the root page', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/sign-in');
    await expect(page).toHaveURL('/sign-in');
  });

  test('Allow navigating to /sign-in', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForURL('/sign-in');
    await expect(page).toHaveURL('/sign-in');
  });

  test('Allow navigating to /sign-up', async ({ page }) => {
    await page.goto('/sign-up');
    await page.waitForURL('/sign-up');
    await expect(page).toHaveURL('/sign-up');
  });
});

test.describe('Authenticated Session', () => {
  test('Do not redirect when visiting the root page', async ({ adaContext }) => {
    const response = await adaContext.page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(adaContext.page).toHaveURL('/');
  });

  test('Display user email in user menu', async ({ adaContext }) => {
    await adaContext.page.goto('/');
    const userEmail = await adaContext.page.getByTestId('user-email');
    // The email for the adaContext is defined in tests/fixtures.ts
    await expect(userEmail).toHaveText('ada@acme.com');
  });

  test('Sign out is available', async ({ adaContext }) => {
    await adaContext.page.goto('/');

    const userNavButton = adaContext.page.getByTestId('user-nav-button');
    await expect(userNavButton).toBeVisible();

    await userNavButton.click();
    const userNavMenu = adaContext.page.getByTestId('user-nav-menu');
    await expect(userNavMenu).toBeVisible();

    const authMenuItem = adaContext.page.getByTestId('user-nav-item-auth');
    await expect(authMenuItem).toContainText('Sign out');

    // We don't click it here as it would sign the test user out
  });

  test('Redirect to root when visiting /sign-in', async ({ adaContext }) => {
    await adaContext.page.goto('/sign-in');
    await adaContext.page.waitForURL('/');
    await expect(adaContext.page).toHaveURL('/');
  });

  test('Redirect to root when visiting /sign-up', async ({ adaContext }) => {
    await adaContext.page.goto('/sign-up');
    await adaContext.page.waitForURL('/');
    await expect(adaContext.page).toHaveURL('/');
  });
});