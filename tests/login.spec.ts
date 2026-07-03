// import { test, expect } from '@playwright/test';
import { test, expect } from '../src/ai/test-with-ai';
import { LoginPage } from '../src/pages/login.page';

// Generates a unique email per test run so registration never collides
// with a previous run's data.
function uniqueEmail(): string {
  return `sdet.testuser.${Date.now()}@test.com`;
}

test.describe('Login Module', () => {

  test('LOGIN-001 - Successful registration with valid details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = uniqueEmail();

    await loginPage.register('SDET Test User', email, 'ValidPass123!');

    // Registration should redirect to login (or show a success toast) —
    // adjust assertion based on actual observed behavior.
    await loginPage.expectSuccessMessage("User account created successfully");
  });

  test('LOGIN-007 - Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = uniqueEmail();
    const password = 'ValidPass123!';

    // Arrange: register a fresh account so this test doesn't depend on
    // a pre-seeded user existing.
    await loginPage.register('SDET Test User', email, password);

    // Act
    await loginPage.login(email, password);

    // Assert
    await loginPage.expectLoggedIn();
  });

  test('LOGIN-009 - Login fails with incorrect password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = uniqueEmail();
    const correctPassword = 'ValidPass123!';

    await loginPage.register('SDET Test User', email, correctPassword);

    await loginPage.login(email, 'WrongPassword!');

    await loginPage.expectErrorMessage(/Incorrect email address or password/i);
    await expect(page).toHaveURL(/.*\/notes\/app\/login/);
  });

  test('LOGIN-010 - Login fails with an unregistered email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('this-email-does-not-exist@test.com', 'SomePassword123!');

    // Deliberately wrong assertion (expects a WELCOME message that will
    // never appear on a failed login) so this test fails on purpose —
    // this failure becomes the real input for Task 3's Failure Explainer.
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

});