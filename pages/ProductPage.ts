import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly nameHeading = this.page.locator("h1.productname");
  readonly price = this.page.locator(".productpageprice .productfilneprice");
  readonly totalPrice = this.page.locator(".total-price");
  readonly addToCartButton = this.page.locator(".productpagecart a.cart");


  async getName(): Promise<string> {
    return (await this.nameHeading.textContent())?.trim() ?? "";
  }

  async getPrice(): Promise<string> {
    return (await this.price.textContent())?.trim() ?? "";
  }

  async getTotalPrice(): Promise<string> {
    await expect(this.totalPrice).not.toBeEmpty();
    return (await this.totalPrice.textContent())?.trim() ?? "";
  }

  async addToCart(): Promise<void> {
    await expect(async () => {
      await this.addToCartButton.click();
      await this.page.waitForURL(/rt=checkout\/cart/, { timeout: 5000 });
    }).toPass({ timeout: 30000 });
  }
}
