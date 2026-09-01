export const SEARCH_PRODUCT = {
  searchTerm: "bronzer",
  name: "Skinsheen Bronzer Stick",
} as const;

export const TEST_PRODUCTS = {
  first: { name: "Skinsheen Bronzer Stick", categoryPath: "36_40" },
  second: { name: "Delicate Oil-Free Powder Blush", categoryPath: "36" },
} as const;

export const CATEGORY_FILTER_TEST = {
  category: { name: "Skincare", path: "43" },
  sortOption: "Price Low > High",
} as const;

export const NAVIGATION_TEST = {
  parentCategory: { name: "Makeup", path: "36" },
  subCategory: { name: "Face", path: "36_38" },
} as const;

export const NEGATIVE_SEARCH_TERM = "qwertynonsensesuperproduct123";

export const NO_RESULTS_MESSAGE = "There is no product that matches the search criteria.";

export const EMPTY_CART_MESSAGE = "Your shopping cart is empty!";
