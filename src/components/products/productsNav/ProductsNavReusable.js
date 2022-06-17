import { getProducts } from "../../../api.js";
import {
  getItemsFromLocalStorage,
  saveInLocalStorage,
} from "../../../localStorage.js";
import { rerender } from "../../../utils.js";
import { Products } from "../Products.js";

export const renderSortMethods = () => {
  return `
        <ul class="filter-methods">
            <li>Most Popular</li>
            <li>Newest</li>
            <li>Best Rated</li>
            <li>Lowest Price</li>
            <li>Highest Price</li>
        </ul>
        <div class="filter-buttons">
            <button class="filter-save">Save</button>
        </div>
        `;
};

export const renderFilterBrands = async () => {
  const products = await getProducts();
  const productsBrands = products.map((product) => ({
    brand: product.brand,
    logo: product.brand_logo,
  }));
  const productsUniqueBrands = [...new Set(productsBrands)];
  return `
  <ul class="filter-methods">
  ${productsUniqueBrands
    .map(
      (product) =>
        `<li><span class="filter-methods__icon"><img src=${product.logo} alt=${
          product.brand
        }></span>${
          product.brand[0].toUpperCase() + product.brand.substring(1)
        }</li>`
    )
    .join("")}
    </ul>
    <div class="filter-buttons">
      <button class="filter-save">Save</button>
      <button class="filter-clear">Clear Filters</button>
    </div>
      `;
};

export const renderFilterColors = async () => {
  const products = await getProducts();
  const productsColors = products.map((product) => product.color).sort();
  const productsUniqueColors = [...new Set(productsColors)];
  return `
    <ul class="filter-methods">
    ${productsUniqueColors
      .map(
        (color) => `
      <li><span class="filter-methods__icon" style="background-color: ${color}"></span>${
          color[0].toUpperCase() + color.substring(1)
        }</li>
    `
      )
      .join("")}
    </ul>
    <div class="filter-buttons">
      <button class="filter-save">Save</button>
      <button class="filter-clear">Clear Filters</button>
    </div>
      `;
};

export const saveSortBtnControl = (e) => {
  const saveBtn = e.target;
  const listContainer = saveBtn.parentElement.parentElement;
  const activeSortOption = listContainer.querySelector(".active");
  let selectedSortOption = getItemsFromLocalStorage("sortMethod");
  // swap sort method that was selected before to actually clicked
  selectedSortOption = activeSortOption.innerText;
  // save clicked sort methos in local storage
  saveInLocalStorage("sortMethod", selectedSortOption);
};

// function for save btns and reset filter bts
export const saveResetFilterBtnsControl = () => {
  let selectedSortOption = getItemsFromLocalStorage("sortMethod");
  // rerender products, according to selected sort method
  renderProductsInOrder(selectedSortOption);
  // main container of products to rerender component in written below functions
  const productsContainer = document.getElementById("products");
  rerender(productsContainer, Products);
};

// function to load previously selected products and add active to list
export const loadActiveClass = (localStorageKey, item) => {
  const prevSelected = getItemsFromLocalStorage(localStorageKey.toLowerCase());
  prevSelected.forEach((option) => {
    if (option.toLowerCase() === item.innerText.toLowerCase()) {
      item.classList.add("active");
    }
  });
};

// remove selected items from loca storage - functionality for clea filters buttons
export const removeSelectedItemsFromStorage = (...localStorageKeys) => {
  localStorageKeys.forEach((key) => {
    let selectedItems = getItemsFromLocalStorage(key.toLowerCase());
    if (!selectedItems || selectedItems.length === 0) {
      return;
    } else {
      selectedItems = [];
      saveInLocalStorage(key.toLowerCase(), selectedItems);
    }
  });
};

// remove active class from list li
export const removeActiveFromItems = (container) => {
  const selectedListOption = container.querySelectorAll(
    ".filter-methods > li.active"
  );
  if (selectedListOption) {
    selectedListOption.forEach((option) => {
      option.classList.remove("active");
    });
  }
};

// function for save btn when user can select many product properties
export const saveMultipleSelectionList = (itemsList, localStorageKey) => {
  const actuallySelectedItems = Array.from(
    itemsList.querySelectorAll(".active")
  ).map((item) => item.innerText);
  let selectedItems = getItemsFromLocalStorage(localStorageKey);
  // swap previously selected items to actual
  selectedItems = actuallySelectedItems;
  // save items in local storage
  saveInLocalStorage(localStorageKey, selectedItems);
};

// main function to redender products in selected way-------------
export const renderProductsInOrder = async (method) => {
  const selectedMethod =
    method.length === 0 ? "MOST POPULAR" : method.toUpperCase();
  let products = await getProducts();
  let selectedBrands = getItemsFromLocalStorage("brands");
  let selectedColors = getItemsFromLocalStorage("colors");
  // filter products by color
  products = selectProductsByProp(products, "color", selectedColors);
  // filter products by brand
  products = selectProductsByProp(products, "brand", selectedBrands);
  // filter products by search input
  const input = document.querySelector(".filter-column.search input");
  if (input) products = selectProductsBySearch(products, input.value);
  // sort
  switch (selectedMethod) {
    case "MOST POPULAR":
      products.sort((a, b) => b.numReviews - a.numReviews);
      break;
    case "LOWEST PRICE":
      products.sort((a, b) => a.price - b.price);

      break;
    case "HIGHEST PRICE":
      products.sort((a, b) => b.price - a.price);
      break;
    case "BEST RATED":
      products.sort((a, b) => b.rating - a.rating);
      break;
    case "NEWEST":
      products.sort(
        (a, b) => new Date(b.adding_date) - new Date(a.adding_date)
      );
      break;
    default:
      break;
  }
  return products;
};

const selectProductsByProp = (products, prop, items) => {
  let output = [];
  if (!items || items.length === 0) {
    output = products;
  } else {
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (products[i][prop].toUpperCase() === items[j].toUpperCase()) {
          output.push(products[i]);
        }
      }
    }
  }
  return output;
};

const selectProductsBySearch = (products, searchInput) => {
  let output = [];
  // limit products properties to ones that user can search
  let productsForLoop = products.map((product) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    color: product.color,
  }));
  // loop over "limited products" to find searching ones
  let loopOutput = [];
  if (!searchInput || searchInput.length === 0) {
    output = products;
  } else {
    for (let i = 0; i < productsForLoop.length; i++) {
      for (const value in productsForLoop[i]) {
        if (productsForLoop[i][value].toLowerCase().startsWith(searchInput)) {
          // check if products dont duplicate in loop output
          if (!loopOutput.includes(productsForLoop[i]))
            loopOutput.push(productsForLoop[i]);
        }
      }
    }
    // find products from the loop in products and add them to output
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < loopOutput.length; j++) {
        if (products[i]["_id"] === loopOutput[j]["id"]) {
          output.push(products[i]);
        }
      }
    }
  }
  return output;
};

//   -------------------------------------------------------------------------
