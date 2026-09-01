import { test, expect } from "@playwright/test";
import { CategoryPage } from "../pages/CategoryPage";
import { NAVIGATION_TEST } from "../support/testData";

function categoryPathParam(url: string): string | null {
  return new URL(url).searchParams.get("path");
}

test.describe("Navigation, URL and breadcrumb consistency", () => {
  test("navigates into a subcategory and back via the breadcrumb", async ({ page }) => {
    const category = new CategoryPage(page);

    let originalProductNames: string[] = [];

    await test.step("Open the parent category and record its product list", async () => {
      await page.goto("/");
      await page
        .locator("ul.nav-pills.categorymenu")
        .getByRole("link", { name: NAVIGATION_TEST.parentCategory.name, exact: true })
        .click();

      await expect(category.productLinks.first()).toBeVisible();
      originalProductNames = await category.getProductNames();
    });

    await test.step("Open the subcategory and verify breadcrumb and URL", async () => {
      await category.openSubcategory(NAVIGATION_TEST.subCategory.name);

      await expect(category.productLinks.first()).toBeVisible();
      expect(await category.getBreadcrumbText()).toEqual([
        "Home",
        NAVIGATION_TEST.parentCategory.name,
        NAVIGATION_TEST.subCategory.name,
      ]);
      expect(categoryPathParam(page.url())).toBe(NAVIGATION_TEST.subCategory.path);
    });

    await test.step("Navigate back via the breadcrumb and verify the product list matches", async () => {
      await category.clickBreadcrumb(NAVIGATION_TEST.parentCategory.name);

      await expect(category.productLinks.first()).toBeVisible();
      expect(categoryPathParam(page.url())).toBe(NAVIGATION_TEST.parentCategory.path);
      expect(await category.getProductNames()).toEqual(originalProductNames);
    });
  });
});