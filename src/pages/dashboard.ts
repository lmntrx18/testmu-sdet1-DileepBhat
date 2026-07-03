import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly noteCards: Locator;
  readonly categoryFilterDropdown: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    // NOTE: verify these data-testid values against the live DOM via DevTools
    // before first run — adjust selectors here if they differ.
    this.noteCards = page.locator('[data-testid="note-card"]');
    this.categoryFilterDropdown = page.locator('[data-testid="category-filter"]');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"]');
  }

  async gotoDashboard() {
    await this.page.goto('/notes/app/notes');
  }

  async waitForNotesToLoad() {
    // Wait for the loader to disappear (if present) rather than a fixed timeout
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // loader may not appear at all if load is instant — safe to ignore
    });
  }

  async getNoteCount(): Promise<number> {
    return this.noteCards.count();
  }

  getCardByIndex(index: number) {
    const card = this.noteCards.nth(index);
    return {
      card,
      title: card.locator('[data-testid="note-card-title"]'),
      description: card.locator('[data-testid="note-card-description"]'),
    };
  }

  async filterByCategory(category: 'Home' | 'Work' | 'Personal') {
    await this.page.getByText(category, { exact: true }).click();
    // Give the filtered list a moment to re-render
    await this.page.waitForTimeout(300);
  }

  async getCardBackgroundColor(index: number): Promise<string> {
    const card = this.noteCards.nth(index);
    return card.locator('[data-testid="note-card-title"]').evaluate((el) => getComputedStyle(el).backgroundColor);
  }

  async getAllVisibleCardBackgroundColors(): Promise<string[]> {
    const count = await this.noteCards.count();
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
        colors.push(await this.getCardBackgroundColor(i));
    }
    return colors;
  }
}