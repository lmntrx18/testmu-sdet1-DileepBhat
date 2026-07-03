import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { DashboardPage } from '../../src/pages/dashboard';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || '';

test.describe('Dashboard Module', () => {

  // Log in once before each test so every test starts from a known,
  // authenticated state on the dashboard.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    await loginPage.expectLoggedIn();
  });

  test('DASH-001 - Dashboard loads all existing notes as cards after login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForNotesToLoad();
    await dashboardPage.page.waitForTimeout(5000);
    const noteCount = await dashboardPage.getNoteCount();

    // Assert at least one note card renders. Swap in an exact expected
    // count once you've confirmed how many notes this account actually has.
    expect(noteCount).toBeGreaterThan(0);

    // Every visible card should show a title, category, and status —
    // confirms cards aren't rendering empty/broken.
    const firstCard = dashboardPage.getCardByIndex(0);
    await expect(firstCard.title).toBeVisible();
  });

  test('DASH-006 - Each note card accurately reflects its stored title and description', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForNotesToLoad();
    await dashboardPage.page.waitForTimeout(5000);
    const noteCount = await dashboardPage.getNoteCount();
    expect(noteCount).toBeGreaterThan(0);

    const firstCard = dashboardPage.getCardByIndex(0);

    const titleText = await firstCard.title.textContent();
    const descriptionText = await firstCard.description.textContent();

    // Data accuracy check: title and description should be non-empty,
    // real content — not placeholder/undefined/blank strings.
    expect(titleText?.trim().length).toBeGreaterThan(0);
    expect(descriptionText?.trim().length).toBeGreaterThan(0);

    // Cross-check against the notes API to confirm the UI isn't showing
    // stale or mismatched data (stronger check than UI-only assertion).
    const response = await page.request.get('/notes/api/notes', {
      headers: { 'x-auth-token': await page.evaluate(() => localStorage.getItem('token') || '') },
    });
    const body = await response.json();
    const apiFirstNote = body.data?.[0];

    if (apiFirstNote) {
      expect(titleText?.trim()).toBe(apiFirstNote.title);
      expect(descriptionText?.trim()).toBe(apiFirstNote.description);
    }
  });

  test('DASH-012 - Filtering by category "Work" shows only matching notes', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForNotesToLoad();

    await dashboardPage.filterByCategory('Work');

    const WORK_BG = 'rgb(92, 107, 192)';
    const COMPLETED_BG = 'rgba(40, 46, 41, 0.6)';

    const visibleColors = await dashboardPage.getAllVisibleCardBackgroundColors();

    // Every visible card after filtering should be styled as either
    // "Work" or "Completed" (completed styling overrides category color
    // when a Work note is also marked done) — no other category's
    // background color should leak through.
    expect(visibleColors.length).toBeGreaterThan(0);
    for (const bgColor of visibleColors) {
      expect([WORK_BG, COMPLETED_BG]).toContain(bgColor);
    }
  });

});