import { test, expect } from "@playwright/test";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";
import { CATEGORY_FILTER_TEST } from "../support/testData";
import { priceTextToNumber } from "../support/priceUtils";

const PRODUCT_INDEX = 2;

test.describe("Category navigation and filtering", () => {
  test("sorts a category's products by price and verifies a product's detail", async ({ page }) => {
    const category = new CategoryPage(page);
    const productPage = new ProductPage(page);
    let expectedName = "";

    await test.step("Open the category and verify products are listed", async () => {
      await category.open(CATEGORY_FILTER_TEST.category.name);
      await expect(category.productLinks.first()).toBeVisible();
      expect((await category.getProductNames()).length).toBeGreaterThan(0);
    });

    await test.step("Sort by price (low to high) and verify ascending order", async () => {
      await category.sortBy(CATEGORY_FILTER_TEST.sortOption);

      const prices = (await category.getProductPrices()).map(priceTextToNumber);
      const ascendingPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(ascendingPrices);

      const sortedNames = await category.getProductNames();
      expectedName = sortedNames[PRODUCT_INDEX];
    });

    await test.step("Open a product from the sorted list and verify its detail matches", async () => {
      await category.openProductAt(PRODUCT_INDEX);
      await expect(productPage.nameHeading).toBeVisible();
      expect(await productPage.getName()).toBe(expectedName);
    });
  });
});