import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly breadcrumbLinks: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly miniCartItemCount: Locator;
  readonly miniCartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumbLinks = page.locator("ul.breadcrumb li a");
    this.searchInput = page.locator("#filter_keyword");
    this.searchSubmitButton = page.locator(".button-in-search");
    this.miniCartItemCount = page.locator("ul.nav.topcart span.label.label-orange.font14");
    this.miniCartTotal = page.locator("ul.nav.topcart span.cart_total");
  }

  async getBreadcrumbText(): Promise<string[]> {
    return (await this.breadcrumbLinks.allTextContents()).map((t) => t.trim());
  }

  async search(term: string): Promise<void> {
    await expect(async () => {
      await this.searchInput.fill(term);
      await Promise.all([
        this.page.waitForURL(/rt=product\/search/, { timeout: 5000 }),
        this.searchSubmitButton.click({ noWaitAfter: true, timeout: 5000 }),
      ]);
    }).toPass({ timeout: 30000 });
  }

  async clickBreadcrumb(name: string): Promise<void> {
    const link = this.breadcrumbLinks.filter({ hasText: name }).first();
    const href = await link.getAttribute("href");
    if (!href) {
      throw new Error(`Breadcrumb entry "${name}" has no href`);
    }
    await Promise.all([this.page.waitForURL(href), link.click()]);
  }

  async getMiniCartItemCount(): Promise<number> {
    const text = await this.miniCartItemCount.textContent();
    return Number(text?.trim() ?? "0");
  }

  async getMiniCartTotal(): Promise<string> {
    return (await this.miniCartTotal.textContent())?.trim() ?? "";
  }
}
