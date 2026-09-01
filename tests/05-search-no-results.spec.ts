import { test, expect } from "@playwright/test";
import { NEGATIVE_SEARCH_TERM, NO_RESULTS_MESSAGE } from "../support/testData";
import { BasePage } from "../pages/BasePage";

test.describe("Negative search scenario", () => {
  test("shows no results and no stale products for a nonsense search term", async ({
    page,
  }) => {
    const resultLinks = page.locator("div.thumbnails.grid a.prdocutname");
    const noResultsMessage = page.getByText(NO_RESULTS_MESSAGE);
    const breadcrumbLinks = page.locator("ul.breadcrumb li a");
    const basePage = new BasePage(page);
    let previousResultNames: string[] = [];

    await test.step("Search for a real term first, to have prior results to clear later", async () => {
      await page.goto("/");
      await basePage.search("bronzer");

      await expect(resultLinks.first()).toBeVisible();
      previousResultNames = (await resultLinks.allTextContents()).map((t) => t.trim());
      expect(previousResultNames.length).toBeGreaterThan(0);
    });

    await test.step("Search a nonsense term and verify the no-results message", async () => {
      await basePage.search(NEGATIVE_SEARCH_TERM);

      await expect(noResultsMessage).toBeVisible();
      expect(await resultLinks.count()).toBe(0);
    });

    await test.step("Verify no results remain from the previous search", async () => {
      for (const name of previousResultNames) {
        await expect(page.getByRole("link", { name, exact: true })).toHaveCount(0);
      }
    });

    await test.step("Verify the page layout is still consitent", async () => {
      await expect(breadcrumbLinks.first()).toBeVisible();
      await expect(page.locator("ul.nav-pills.categorymenu")).toBeVisible();
    });
  });
});
