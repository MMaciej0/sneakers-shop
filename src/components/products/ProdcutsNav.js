import { getProducts } from "../../api.js";
import {
  getItemsFromLocalStorage,
  removeItemFromStorage,
  saveInLocalStorage,
} from "../../localStorage.js";
import { rerender } from "../../utils.js";
import { Products } from "./Products.js";
import { ProductsItems } from "./productsItems/ProductsItems.js";

// function for drop down a lists and add acvite class to selected items (add background to selected items)
const filterBtnControl = (button) => {
  document.addEventListener("click", (e) => {
    const clickedElement = e.target;
    if (clickedElement.closest(".filter-column__container") === null) {
      const activeList = document.querySelector(
        ".filter-column__container.active"
      );
      if (activeList) {
        activeList.classList.remove("active");
        removeActiveFromItems(activeList);
      }
    }
  });
  button.addEventListener("click", (e) => {
    const selectedBtn = e.target;
    const btnMainContainer = selectedBtn.parentElement.parentElement;
    const activeList = document.querySelector(
      ".filter-column__container.active"
    );
    const listOptions = btnMainContainer.querySelectorAll(
      ".filter-methods > li"
    );
    // if there is an other active filter list, hide it
    if (activeList) {
      activeList.classList.remove("active");
      removeActiveFromItems(activeList);
    } else {
      btnMainContainer.classList.toggle("active");
      // functionality for particular filter lists
      if (button.parentElement.classList.contains("sort")) {
        // add active class to list li
        listOptions.forEach((option) => {
          const sortMethod =
            getItemsFromLocalStorage("sortMethod").length === 0
              ? "most popular"
              : getItemsFromLocalStorage("sortMethod");
          if (option.innerText.toLowerCase() == sortMethod.toLowerCase()) {
            option.classList.add("active");
          }
          option.addEventListener("click", (e) => {
            // remove active class
            const activeOption = btnMainContainer.querySelector("li.active");
            if (activeOption) {
              activeOption.classList.remove("active");
            }
            // select option and add active class
            const selectedOption = e.target;
            selectedOption.classList.add("active");
          });
        });
      } else if (
        button.parentElement.classList.contains("brands") ||
        button.parentElement.classList.contains("colors")
      ) {
        listOptions.forEach((item) => {
          addActiveClass("brands", item);
          addActiveClass("colors", item);
          item.addEventListener("click", (e) => {
            const selectedBrand = e.target;
            selectedBrand.classList.toggle("active");
          });
        });
      }
    }
    filterListBtnsControl();
  });
};

// function that adds functionality to to drop down lists buttons (saveBtn and clearBtn)
const filterListBtnsControl = () => {
  const saveSortBtn = document.querySelector(
    ".filter-column__container.sort .saveBtn"
  );
  saveSortBtn.addEventListener("click", (e) => {
    const saveBtn = e.target;
    const saveBtnContainer = saveBtn.parentElement;
    const activeSortOption = saveBtnContainer.querySelector(".active");
    let selectedSortOption = getItemsFromLocalStorage("sortMethod");
    // swap sort method that was selected before to actually clicked
    selectedSortOption = activeSortOption.innerText;
    // save clicked sort methos in local storage
    saveInLocalStorage("sortMethod", selectedSortOption);
  });

  const saveBrandsBtn = document.querySelector(
    ".filter-column__container.brands .saveBtn"
  );
  saveBrandsBtn.addEventListener("click", (e) => {
    const saveBtn = e.target;
    const saveBtnContainer = saveBtn.parentElement;
    saveMultipleSelectionList(saveBtnContainer, "brands");
  });

  const saveColorsBtn = document.querySelector(
    ".filter-column__container.colors .saveBtn"
  );
  saveColorsBtn.addEventListener("click", (e) => {
    const saveBtn = e.target;
    const saveBtnContainer = saveBtn.parentElement;
    saveMultipleSelectionList(saveBtnContainer, "colors");
  });

  const resetFiltersBtns = document.querySelectorAll(
    ".filter-column__container .resetFilters"
  );
  resetFiltersBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedBtn = e.target;
      removeSelectedItemsFromStorage(selectedBtn, "Show All Brands", "brands");
      removeSelectedItemsFromStorage(selectedBtn, "Show All Colors", "colors");
    });
  });

  // functionality for both saveBtns and ResetFilterBtns
  const listBtns = document.querySelectorAll(
    ".filter-column__container button"
  );
  listBtns.forEach((button) => {
    button.addEventListener("click", () => {
      let selectedSortOption = getItemsFromLocalStorage("sortMethod");
      renderProductsInOrder(selectedSortOption);
      // rerender products, according to selected sort method
      // main container of products to rerender component in written below functions
      const productsContainer = document.getElementById("products");
      rerender(productsContainer, Products);
    });
  });

  const searchInput = document.querySelector(".filter-column.search input");
  searchInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    const sortMethod = getItemsFromLocalStorage("sortMethod");
    renderProductsInOrder(sortMethod);
    const productsItems = document.querySelector(".products-center");
    rerender(productsItems, ProductsItems);
  });
};

// function that controls products order after click on save btn in drop down lists and after reload the page
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

// close filter tabs functiuon
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

// reusable functions for navbar main functions

const removeSelectedItemsFromStorage = (button, buttonTxt, localStorageKey) => {
  if (button.innerText == buttonTxt) {
    let selectedItems = getItemsFromLocalStorage(localStorageKey);
    if (!selectedItems || selectedItems.length === 0) {
      return;
    } else {
      selectedItems = [];
      saveInLocalStorage(localStorageKey, selectedItems);
    }
  }
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

const saveMultipleSelectionList = (container, localStorageKey) => {
  const actuallySelectedItems = Array.from(
    container.querySelectorAll(".active")
  ).map((item) => item.innerText);
  let selectedItems = getItemsFromLocalStorage(localStorageKey);
  // swap previously selected items to actual
  selectedItems = actuallySelectedItems;
  // save items in local storage
  saveInLocalStorage(localStorageKey, selectedItems);
};

const removeActiveFromItems = (container) => {
  const selectedListOption = container.querySelectorAll(
    ".filter-methods > li.active"
  );
  if (selectedListOption) {
    selectedListOption.forEach((option) => {
      option.classList.remove("active");
    });
  }
};

const addActiveClass = (localStorageKey, item) => {
  const prevSelected = getItemsFromLocalStorage(localStorageKey);
  prevSelected.forEach((option) => {
    if (option === item.innerText) {
      item.classList.add("active");
    }
  });
};

const renderSortMethods = () => {
  return `
      <ul class="filter-methods" data-visible="false">
      <li>Most Popular</li>
      <li>Newest</li>
      <li>Best Rated</li>
      <li>Lowest Price</li>
      <li>Highest Price</li>
      <button class="saveBtn">Save</button>
      </ul>
      `;
};

// ------mobile-------

const closeMobileFilterScreen = (parent, container) => {
  document.querySelector(".screen-close").addEventListener("click", () => {
    parent.setAttribute("data-visible", false);
    removeChilds(container);
  });
};

const mobileSortScreenControl = () => {
  const container = document.querySelector(".screen-container");
  container.innerHTML = `<span class="screen-header">Sort By:</span>
    ${renderSortMethods()}
    `;
  const screen = document.querySelector(".filter-mobile__screen");
  screen.setAttribute("data-visible", true);

  closeMobileFilterScreen(screen, container);

  const options = screen.querySelectorAll(".filter-methods > li");
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      // remove active class
      screen.querySelector("li.active").classList.remove("active");
      // select option and add active class
      const selectedOption = e.target;
      selectedOption.classList.add("active");
    });
  });
};

const mobileFilterScreenControl = () => {
  const screen = document.querySelector(".filter-mobile__screen");
  const container = document.querySelector(".screen-container");
  screen.setAttribute("data-visible", true);
  container.innerHTML = `
    <span class="screen-header">Filters</span>
    <ul class="filter-methods sort">
      <li>
      <span>Brand</span>
      <span class="filter-brand"></span>
      <i class="fas fa-chevron-right"></i>
      </li>
      <li>
      <span>Color</span>
      <span class="filter-brand"></span>
      <i class="fas fa-chevron-right"></i>
      </li>
      <button class="saveBtn">Save</button>
      <button>Clear Filters</button>
    </ul>
    `;
  closeMobileFilterScreen(screen, container);
};

// end of mobile

export const ProductsNav = {
  after_render: () => {
    const mobileSortBtn = document.querySelector(".sort-btn");
    mobileSortBtn.addEventListener("click", mobileSortScreenControl);
    const mobileFilterBtn = document.querySelector(".filter-btn");
    mobileFilterBtn.addEventListener("click", mobileFilterScreenControl);
    const filterBtns = document.querySelectorAll(".filter-column");
    filterBtns.forEach((button) => filterBtnControl(button));
    const closeTabBtns = document.querySelectorAll(".filter-tab > i");
    closeTabBtns.forEach((button) => closeTabControl(button));
  },
  render: async () => {
    const products = await getProducts();
    const productsColors = products.map((product) => product.color).sort();
    const productsBrands = products.map((product) => ({
      brand: product.brand,
      logo: product.brand_logo,
    }));
    const productsUniqueColors = [...new Set(productsColors)];
    const productsUniqueBrands = [...new Set(productsBrands)];
    const sortMethod = getItemsFromLocalStorage("sortMethod");
    const selectedBrands = getItemsFromLocalStorage("brands");
    const selectedColors = getItemsFromLocalStorage("colors");
    return `
        <div class="filter-container">
          <div class="filter-column__container sort">
            <div class="filter-column">
              <span>Sort by</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            ${renderSortMethods()}
          </div>
          <div class="filter-column__container brands">
            <div class="filter-column">
              <span>Brand</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <ul class="filter-methods" data-visible="false">
              ${productsUniqueBrands
                .map(
                  (product) =>
                    `<li><span class="filter-methods__icon"><img src=${
                      product.logo
                    } alt=${product.brand}/></span>${
                      product.brand[0].toUpperCase() +
                      product.brand.substring(1)
                    }</li>`
                )
                .join("")}
              <button class="saveBtn">Save</button>
              <button class="resetFilters">Show All Brands</button>
            </ul>
          </div>
          <div class="filter-column__container colors">
            <div class="filter-column">
              <span>Color</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <ul class="filter-methods" data-visible="false">
            ${productsUniqueColors
              .map(
                (color) =>
                  `<li><span class="filter-methods__icon" style="background-color: ${color}"></span>${
                    color[0].toUpperCase() + color.substring(1)
                  }</li>`
              )
              .join("")}
              <button class="saveBtn">Save</button>
              <button class="resetFilters">Show All Colors</button>
            </ul>
          </div>
          <div class="filter-column__container">
            <form class="filter-column search">
              <input type="search" name="search" placeholder="Search...">
              <i class="fas fa-search"></i>
            </form>
          </div>
          <div class="filter-mobile__btns">
            <button class="sort-btn">Sort</button>
            <button class="filter-btn">Filter</button>
          </div>
          <div class="filter-mobile__screen" data-visible="false">
            <span class="screen-close">
            <i class="fas fa-window-close"></i>
            </span>
            <div class="screen-container"></div>
          </div>
        </div>
        <div class="filter-tabs">
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
        </div>
    `;
  },
};
