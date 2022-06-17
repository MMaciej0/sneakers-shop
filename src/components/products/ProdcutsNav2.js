import { getProducts } from "../../api.js";
import {
  getItemsFromLocalStorage,
  removeItemFromStorage,
  saveInLocalStorage,
} from "../../localStorage.js";
import { removeChilds, rerender } from "../../utils.js";
import { Products } from "./Products.js";
import { ProductsItems } from "./productsItems/ProductsItems.js";
import { renderProductsInOrder } from "./productsNav/ProductsNavReusable.js";

// function for drop down a lists and add acvite class to selected items (add background to selected items)
const filterBtnControl = (button) => {
  // to hide lists when use cliks somewhere on the page
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
    console.log();
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
            const selected = e.target;
            selected.classList.toggle("active");
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
  saveSortBtn.addEventListener("click", (e) => saveSortBtnControl(e));

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
    button.addEventListener("click", saveResetFilterBtnsControl);
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

const saveResetFilterBtnsControl = () => {
  let selectedSortOption = getItemsFromLocalStorage("sortMethod");
  // rerender products, according to selected sort method
  renderProductsInOrder(selectedSortOption);
  // main container of products to rerender component in written below functions
  const productsContainer = document.getElementById("products");
  rerender(productsContainer, Products);
};

const saveSortBtnControl = (e) => {
  const saveBtn = e.target;
  const listContainer = saveBtn.parentElement.parentElement;
  const activeSortOption = listContainer.querySelector(".active");
  let selectedSortOption = getItemsFromLocalStorage("sortMethod");
  // swap sort method that was selected before to actually clicked
  selectedSortOption = activeSortOption.innerText;
  // save clicked sort methos in local storage
  saveInLocalStorage("sortMethod", selectedSortOption);
};

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

const saveMultipleSelectionList = (itemsList, localStorageKey) => {
  const actuallySelectedItems = Array.from(
    itemsList.querySelectorAll(".active")
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

// ------mobile-------

// end of mobile

export const ProductsNav = {
  after_render: () => {
    const filterBtns = document.querySelectorAll(".filter-column");
    filterBtns.forEach((button) => filterBtnControl(button));
    const closeTabBtns = document.querySelectorAll(".filter-tab > i");
    closeTabBtns.forEach((button) => closeTabControl(button));
  },
  render: async () => {
    const products = await getProducts();
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
            <button class="saveBtn">Save</button>
          </div>
          <div class="filter-column__container brands">
            <div class="filter-column">
              <span>Brand</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="filter-methods" data-visible="false">
              <ul >
                ${renderFilterBrands(products)}
              </ul>
              <button class="saveBtn">Save</button>
              <button class="resetFilters">Show All Colors</button>
            </div>
          </div>
          <div class="filter-column__container colors">
            <div class="filter-column">
              <span>Color</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="filter-methods" data-visible="false">
              <ul >
                ${renderFilterColors(products)}
              </ul>
              <button class="saveBtn">Save</button>
              <button class="resetFilters">Show All Colors</button>
            </div> 
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
