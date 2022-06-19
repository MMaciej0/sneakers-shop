import { ProductsItems } from "./productsItems/ProductsItems.js";
import { ProductsNav } from "./productsNav/ProductsNav.js";
import { ProductsNavTabs } from "./productsNav/ProductsNavTabs.js";

export const Products = {
  after_render: () => {
    ProductsNav.after_render();
    ProductsItems.after_render();
    ProductsNavTabs.after_render();
  },
  render: async () => {
    return `
    <nav class="filter-container">
      ${await ProductsNav.render()}
    </nav>
    <div class="filter-tabs">${ProductsNavTabs.render()}</div>
    <div class="products-center">
      ${await ProductsItems.render()}
    </div>
    <div class="overlay overlay-details"></div>
    `;
  },
};
