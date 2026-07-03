import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly loginEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly loginSubmitBtn: Locator;
  readonly registerSubmitBtn: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // NOTE: verify these data-testid values against the live DOM via DevTools
    // before first run — adjust selectors here if they differ.
    this.nameInput = page.locator('[data-testid="register-name"]');
    this.emailInput = page.locator('[data-testid="register-email"]');
    this.loginEmailInput = page.locator('[data-testid="login-email"]');
    this.passwordInput = page.locator('[data-testid="register-password"]');
    this.loginPasswordInput = page.locator('[data-testid="login-password"]');
    this.confirmPasswordInput = page.locator('[data-testid="register-confirm-password"]');
    this.loginSubmitBtn = page.locator('[data-testid="login-submit"]');
    this.registerSubmitBtn = page.locator('[data-testid="register-submit"]');
    this.registerLink = page.locator('[data-testid="register-link"]');
    this.errorMessage = page.locator('[data-testid="alert-message"]');
    this.successMessage = page.locator('.alert.alert-success');
  }

  async gotoLogin() {
    await this.page.goto('/notes/app/login');
  }

  async gotoRegister() {
    await this.page.goto('/notes/app/register');
  }

  async register(name: string, email: string, password: string) {
    await this.gotoRegister();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerSubmitBtn.click();
  }

  async login(email: string, password: string) {
    await this.gotoLogin();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitBtn.click();
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/\/notes\/app/);
  }

  async expectErrorMessage(expectedText: string | RegExp) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async expectSuccessMessage(expectedText: string | RegExp) {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(expectedText);
  }
}