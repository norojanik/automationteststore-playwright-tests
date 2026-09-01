import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CategoryPage extends BasePage {
  readonly productLinks = this.page.locator("div.thumbnails.grid a.prdocutname");
  readonly productPrices = this.page.locator(
    "div.thumbnails.grid .price .pricenew, div.thumbnails.grid .price .oneprice"
  );
  readonly sortSelect = this.page.locator("#sort");

  async open(categoryName: string): Promise<void> {
    await this.page.goto("/");
    await this.page
      .locator("ul.nav-pills.categorymenu")
      .getByRole("link", { name: categoryName, exact: true })
      .click();
  }

  async getProductNames(): Promise<string[]> {
    return (await this.productLinks.allTextContents()).map((t) => t.trim());
  }

  async getProductPrices(): Promise<string[]> {
    return (await this.productPrices.allTextContents()).map((t) => t.trim());
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortSelect.selectOption({ label: optionLabel });
    await this.page.waitForURL(/sort=/);
  }

  async openProductAt(index: number): Promise<void> {
    await this.productLinks.nth(index).click();
  }

  async openSubcategory(name: string): Promise<void> {
    await this.page.locator("ul.thumbnails.row").getByRole("link", { name, exact: true }).click();
  }
}