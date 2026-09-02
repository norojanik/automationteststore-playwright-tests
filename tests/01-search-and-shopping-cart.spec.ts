import { test, expect } from "@playwright/test";
import { TEST_PRODUCTS } from "../support/testData";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";

test.describe("Search and purchase flow", () => {
  test("search for product, add it to the cart, then removes it", async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    let productName = "";
    let productPrice = "";

    await test.step("Search for the product and open it from the results", async () => {
      await page.goto("/");
      await productPage.searchInput.fill(TEST_PRODUCTS.first.name);
      await productPage.searchSubmitButton.click();
    });

    await test.step("Verify the product details - name, price", async () => {
      await expect(productPage.nameHeading).toBeVisible();

      productName = await productPage.getName();
      expect(productName).toBe(TEST_PRODUCTS.first.name);

      productPrice = await productPage.getPrice();
      expect(productPrice).toMatch(/^\$\d/);
      expect(await productPage.getTotalPrice()).toBe(productPrice);
    });

    await test.step("Add the product to the cart and assert that it contains 1 piece", async () => {
      await productPage.addToCart();
      await expect.poll(() => productPage.getMiniCartItemCount()).toBe(1);
    });

    await test.step("Verify the cart shows the product with matching price and name", async () => {
      await cartPage.goto();
      expect(await cartPage.getItemCount()).toBe(1);

      const cartItem = await cartPage.getItem(productName);
      expect(cartItem.unitPrice).toBe(productPrice);
      expect(cartItem.quantity).toBe("1");
    });

    await test.step("Remove the product and verify the cart is empty", async () => {
      await cartPage.removeItem(productName);
      await expect(cartPage.emptyCartMessage).toBeVisible();
      expect(await cartPage.isEmpty()).toBe(true);
    });
  });
});
