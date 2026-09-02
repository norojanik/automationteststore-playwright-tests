import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { EMPTY_CART_MESSAGE } from "../support/testData";

export interface CartLineItem {
  name: string;
  unitPrice: string;
  quantity: string;
  total: string;
}

export class CartPage extends BasePage {
  readonly itemRows = this.page
    .locator("tr")
    .filter({ has: this.page.locator('input[name^="quantity["]') });
  readonly updateButton = this.page.locator("#cart_update");
  readonly emptyCartMessage = this.page.getByText(EMPTY_CART_MESSAGE);

  async goto(): Promise<void> {
    await this.page.goto("/index.php?rt=checkout/cart");
  }

  private rowByName(name: string): Locator {
    const exact = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
    return this.itemRows.filter({ has: this.page.locator("td.align_left a", { hasText: exact }) });
  }

  async getItemCount(): Promise<number> {
    return this.itemRows.count();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.getItemCount()) === 0;
  }

  async getItems(): Promise<CartLineItem[]> {
    const rows = await this.itemRows.all();
    const items: CartLineItem[] = [];
    for (const row of rows) {
      const name = (await row.locator("td.align_left a").first().textContent())?.trim() ?? "";
      const unitPrice = (await row.locator("td.align_right").nth(0).textContent())?.trim() ?? "";
      const quantity = await row.locator('input[name^="quantity["]').inputValue();
      const total = (await row.locator("td.align_right").nth(1).textContent())?.trim() ?? "";
      items.push({ name, unitPrice, quantity, total });
    }
    return items;
  }

  async getItem(name: string): Promise<CartLineItem> {
    const items = await this.getItems();
    const item = items.find((i) => i.name === name);
    if (!item) {
      throw new Error(`No cart line item found for product "${name}"`);
    }
    return item;
  }

  async updateQuantity(name: string, quantity: number): Promise<void> {
    await this.rowByName(name).locator('input[name^="quantity["]').fill(String(quantity));
    await this.updateButton.click();
  }

  async removeItem(name: string): Promise<void> {
    await this.rowByName(name).locator('a[href*="remove="]').click();
  }
}
