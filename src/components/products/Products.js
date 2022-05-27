import { ProductsNav } from "./ProdcutsNav.js";
import { ProductsItems } from "./productsItems/ProductsItems.js";

export const Products = {
  after_render: () => {
    ProductsNav.after_render();
    ProductsItems.after_render();
  },
  render: async () => {
    return `
        ${await ProductsNav.render()}
        <div class="products-center">
        ${await ProductsItems.render()}
        </div>
        <div class="overlay overlay-details"></div>
        `;
  },
};
