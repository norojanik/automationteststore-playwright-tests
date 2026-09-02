import { test, expect } from "@playwright/test";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { TEST_PRODUCTS } from "../support/testData";
import { priceTextToNumber, roundToCents } from "../support/priceUtils";
import { CategoryPage } from "../pages/CategoryPage";

test.describe("Cart with multiple items", () => {
  test("manages quantities and removal across multiple cart items", async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const categoryPage = new CategoryPage(page);

    const prices: Record<string, string> = {};

    await test.step("Add two different products to the cart", async () => {
      for (const product of [TEST_PRODUCTS.first, TEST_PRODUCTS.second]) {
        await page.goto(`/index.php?rt=product/category&path=${product.categoryPath}`);
        await categoryPage.productLinks.filter({ hasText: product.name }).first().click();

        await expect(productPage.nameHeading).toBeVisible();
        prices[product.name] = await productPage.getPrice();
        await productPage.addToCart();
      }
    });

    await test.step("Verify both items show the correct name, price and quantity", async () => {
      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(2);

      const firstItem = await cartPage.getItem(TEST_PRODUCTS.first.name);
      const secondItem = await cartPage.getItem(TEST_PRODUCTS.second.name);

      expect(firstItem.unitPrice).toBe(prices[TEST_PRODUCTS.first.name]);
      expect(firstItem.quantity).toBe("1");
      expect(secondItem.unitPrice).toBe(prices[TEST_PRODUCTS.second.name]);
      expect(secondItem.quantity).toBe("1");
    });

    await test.step("Change one product's quantity and verify the recalculated total", async () => {
      const newQuantity = 3;
      await cartPage.updateQuantity(TEST_PRODUCTS.first.name, newQuantity);

      const updatedFirstItem = await cartPage.getItem(TEST_PRODUCTS.first.name);
      expect(updatedFirstItem.quantity).toBe(String(newQuantity));
      expect(priceTextToNumber(updatedFirstItem.total)).toBe(
        roundToCents(priceTextToNumber(updatedFirstItem.unitPrice) * newQuantity),
      );
    });

    await test.step("Remove one product and verify the other is unaffected", async () => {
      await cartPage.removeItem(TEST_PRODUCTS.first.name);

      expect(await cartPage.getItemCount()).toBe(1);
      const remainingItem = await cartPage.getItem(TEST_PRODUCTS.second.name);
      expect(remainingItem.unitPrice).toBe(prices[TEST_PRODUCTS.second.name]);
      expect(remainingItem.quantity).toBe("1");
    });
  });
});
