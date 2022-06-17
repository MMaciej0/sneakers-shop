import { ProductsNavMobile } from "./ProductsNavMobile.js";

export const ProductsNav = {
  after_render: () => {
    ProductsNavMobile.after_render();
  },
  render: () => {
    return `
    <div class="filter-container">
     ${ProductsNavMobile.render()} 
    </div>
    `;
  },
};
