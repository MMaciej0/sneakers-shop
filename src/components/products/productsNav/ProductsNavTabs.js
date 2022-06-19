import {
  getItemsFromLocalStorage,
  removeItemFromStorage,
} from "../../../localStorage.js";
import { rerender } from "../../../utils.js";
import { ProductsItems } from "../productsItems/ProductsItems.js";
import { renderProductsInOrder } from "./ProductsNavReusable.js";

const closeTabControl = (button) => {
  button.addEventListener("click", (e) => {
    const selectedPropTxt = e.target.parentElement.innerText;
    // get prodycts filter props from local and check if it is selected one then delete this prop from store and update products
    removeItemFromStorage("brands", selectedPropTxt);
    removeItemFromStorage("colors", selectedPropTxt);
    // remove tab
    const selectedProp = e.target.parentElement;
    const propContainer = e.target.parentElement.parentElement;
    propContainer.removeChild(selectedProp);
    const sortMethod = getItemsFromLocalStorage("sortMethod");
    renderProductsInOrder(sortMethod);
    const productsItems = document.querySelector(".products-center");
    rerender(productsItems, ProductsItems);
  });
};

export const ProductsNavTabs = {
  after_render: () => {
    const closeTabBtns = document.querySelectorAll(".filter-tab > i");
    closeTabBtns.forEach((button) => closeTabControl(button));
  },
  render: () => {
    const sortMethod = getItemsFromLocalStorage("sortMethod");
    const selectedBrands = getItemsFromLocalStorage("brands");
    const selectedColors = getItemsFromLocalStorage("colors");
    return `
          ${
            sortMethod.length === 0
              ? `<div class="filter-tab sort">Sorted by:<span>Most Popular</span></div>`
              : `<div class="filter-tab sort">Sorted by:<span>${sortMethod}</span></div>`
          }
          ${selectedBrands
            .map(
              (brand) =>
                `<div class="filter-tab">${brand}<i class="fas fa-window-close"></i></div>`
            )
            .join("")}
          ${selectedColors
            .map(
              (color) =>
                `<div class="filter-tab">${color}<i class="fas fa-window-close"></i></div>`
            )
            .join("")}
        `;
  },
};
