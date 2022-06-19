import { getProducts } from "../../../api.js";
import { getItemsFromLocalStorage } from "../../../localStorage.js";
import { rerender } from "../../../utils.js";
import { ProductsItems } from "../productsItems/ProductsItems.js";
import {
  loadActiveClass,
  removeActiveFromItems,
  removeSelectedItemsFromStorage,
  renderFilterBrands,
  renderFilterColors,
  renderProductsInOrder,
  renderSortMethods,
  saveMultipleSelectionList,
  saveResetFilterBtnsControl,
  saveSortBtnControl,
} from "./ProductsNavReusable.js";

// MOBILE---------------------------------------------------------
// sort button---------------------------------------------------------

const mobileSortScreenControl = () => {
  const mainScreen = document.querySelector(".filter-mobile__screen.sort");
  mainScreen.setAttribute("data-visible", true);
  const mainInnerContainer = mainScreen.querySelector(".screen-container");
  mainInnerContainer.innerHTML = `
    <div class="screen-header">
      <span class="screen-heading">Sort By</span> 
      <i class="fas fa-window-close"></i>
    </div>
    <div class="screen-body">
      ${renderSortMethods()}
    </div>
    `;
  // close btn
  const closeBtn = mainInnerContainer.querySelector(".fa-window-close");
  closeBtn.addEventListener("click", () =>
    mainScreen.setAttribute("data-visible", false)
  );
  // add hover effect on actually selected sort method
  const options = mainScreen.querySelectorAll(".filter-methods > li");
  options.forEach((option) => {
    const sortMethod =
      getItemsFromLocalStorage("sortMethod").length === 0
        ? "most popular"
        : getItemsFromLocalStorage("sortMethod");
    if (sortMethod.toLowerCase() === option.innerText.toLowerCase()) {
      option.classList.add("active");
    }
    // remove hover effect from previously selected sort method and add to clicked one
    option.addEventListener("click", (e) => {
      // remove active class
      mainScreen.querySelector("li.active").classList.remove("active");
      // select option and add active class
      const selectedOption = e.target;
      selectedOption.classList.add("active");
    });
  });
  // save btn functionality
  const saveBtn = mainScreen.querySelector(".filter-save");
  saveBtn.addEventListener("click", (e) => {
    saveSortBtnControl(e);
    saveResetFilterBtnsControl();
  });
};

// --------------------------------------filter button-----------

const mobileFilterScreenControl = async () => {
  const products = await getProducts();
  const mainScreen = document.querySelector(".filter-mobile__screen.filter");
  mainScreen.setAttribute("data-visible", true);
  const mainInnerContainer = mainScreen.querySelector(".screen-container");
  const mainFilterProps = mainInnerContainer.querySelectorAll(
    ".filter-methods .filter-prop"
  );
  const propScreen = document.querySelector(".filter-mobile__screen.prop");
  const propInnerContainer = propScreen.querySelector(".screen-container");
  const propHeader = propInnerContainer.querySelector(".screen-heading");
  const propBody = propInnerContainer.querySelector(".screen-body");
  // show filter prop screen when when click on filter prop on main screen
  mainFilterProps.forEach((prop) => {
    prop.addEventListener("click", async (e) => {
      const selectedProp = e.target.innerText.toLowerCase();
      if (selectedProp === "brands") {
        propHeader.innerText = "Brands";
        propBody.innerHTML = renderFilterBrands("Clear Filters", products);
      } else if (selectedProp === "colors") {
        propHeader.innerText = "Colors";
        propBody.innerHTML = renderFilterColors("Clear Filters", products);
      }
      propScreen.setAttribute("data-visible", true);
      // functionality for all prop screens when open
      if (propScreen.getAttribute("data-visible") === "true") {
        const propItems = propBody.querySelectorAll(".filter-methods li");
        propItems.forEach((prop) => {
          loadActiveClass(e.target.innerText, prop);
          prop.addEventListener("click", (e) => {
            const selected = e.target;
            selected.classList.toggle("active");
          });
        });
        const saveBtn = propBody.querySelector(".filter-save");
        saveBtn.addEventListener("click", () => {
          const propList = propBody.querySelector(".filter-methods");
          saveMultipleSelectionList(propList, selectedProp);
          // rerender main screen to show selected properties
          const filterResultField = mainInnerContainer.querySelector(
            `.result-${selectedProp}`
          );
          filterResultField.innerText =
            getItemsFromLocalStorage(selectedProp).length > 0
              ? `Selected ${selectedProp}: ${getItemsFromLocalStorage(
                  selectedProp
                ).join(", ")}`
              : "";
          propScreen.setAttribute("data-visible", false);
        });
        const clearBtn = propBody.querySelector(".filter-clear");
        clearBtn.addEventListener("click", () => {
          removeSelectedItemsFromStorage(selectedProp);
          removeActiveFromItems(propBody);
        });
      }
    });
  });
  // functionalities for static buttons
  // close all screens when click on close btn
  const closeBtns = document.querySelectorAll(
    ".screen-container .fa-window-close"
  );
  closeBtns.forEach((button) => {
    button.addEventListener("click", () => {
      mainScreen.setAttribute("data-visible", false);
      propScreen.setAttribute("data-visible", false);
    });
  });
  // close prop screen when click on back arrow
  const propBackArrow = propInnerContainer.querySelector(".fa-chevron-left");
  if (propBackArrow) {
    propBackArrow.addEventListener("click", () => {
      propScreen.setAttribute("data-visible", false);
    });
  }
  // save btn
  const saveBtn = mainInnerContainer.querySelector(".filter-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveResetFilterBtnsControl);
  }
  // clear filters
  const clearBtn = mainInnerContainer.querySelector(".filter-clear");
  clearBtn.addEventListener("click", () => {
    removeSelectedItemsFromStorage("brands", "colors");
    const filterResults = mainInnerContainer.querySelectorAll(".filter-result");
    filterResults.forEach((result) => (result.innerText = ""));
  });
};
// ------------------------------------------
// end of mobile-----------------------------------------------------------
// -------------------------------------------

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
          loadActiveClass("brands", item);
          loadActiveClass("colors", item);
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

const filterListBtnsControl = () => {
  const saveSortBtn = document.querySelector(
    ".filter-column__container.sort .filter-save"
  );
  saveSortBtn.addEventListener("click", (e) => saveSortBtnControl(e));

  const saveBrandsBtn = document.querySelector(
    ".filter-column__container.brands .filter-save"
  );
  saveBrandsBtn.addEventListener("click", (e) => {
    const saveBtn = e.target;
    const brandsList = saveBtn.parentElement.parentElement;
    saveMultipleSelectionList(brandsList, "brands");
  });

  const saveColorsBtn = document.querySelector(
    ".filter-column__container.colors .filter-save"
  );
  saveColorsBtn.addEventListener("click", (e) => {
    const saveBtn = e.target;
    const colorsList = saveBtn.parentElement.parentElement;
    saveMultipleSelectionList(colorsList, "colors");
  });

  const resetFiltersBtns = document.querySelectorAll(
    ".filter-column__container .filter-clear"
  );
  resetFiltersBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedBtn = e.target;
      if (selectedBtn.innerText == "Show All Brands") {
        removeSelectedItemsFromStorage("brands");
      } else if (selectedBtn.innerText == "Show All Colors") {
        removeSelectedItemsFromStorage("colors");
      }
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

export const ProductsNav = {
  after_render: () => {
    const mobileSortBtn = document.querySelector(
      ".filter-mobile__btns > .sort-btn"
    );
    mobileSortBtn.addEventListener("click", mobileSortScreenControl);
    const mobileFilterBtn = document.querySelector(".filter-btn");
    mobileFilterBtn.addEventListener("click", mobileFilterScreenControl);
    const filterBtns = document.querySelectorAll(".filter-column");
    filterBtns.forEach((button) => filterBtnControl(button));
  },
  render: async () => {
    const products = await getProducts();
    const actualySelectedBrands = getItemsFromLocalStorage("brands");
    const actualySelectedColors = getItemsFromLocalStorage("colors");
    return `
    <div class="filter-column__container sort">
          <div class="filter-column">
            <span>Sort by</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="filter-list" data-visible="false">
            ${renderSortMethods()}
          </div>
        </div>
        <div class="filter-column__container brands">
          <div class="filter-column">
            <span>Brand</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="filter-list" data-visible="false">
            ${await renderFilterBrands("Show All Brands", products)}
          </div>
        </div>
        <div class="filter-column__container colors">
          <div class="filter-column">
            <span>Color</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="filter-list" data-visible="false">
            ${await renderFilterColors("Show All Colors", products)}
          </div> 
        </div>
        <div class="filter-column__container">
          <form class="filter-column search">
            <input type="search" name="search" placeholder="Search...">
            <i class="fas fa-search"></i>
          </form>
        </div>
    </div>

    <div class="filter-mobile__btns">
     <button class="sort-btn">Sort</button>
     <button class="filter-btn">Filter</button>
    </div>
    <div class="filter-mobile__screen sort" data-visible="false">
      <div class="screen-container"></div>
    </div>
    <div class="filter-mobile__screen filter" data-visible="false">
     <div class="screen-container">
       <div class="screen-header">
         <span class="screen-heading">Filters:</span>
         <i class="fas fa-window-close"></i>
       </div>
       <div class="screen-body">
         <ul class="filter-methods">
           <li>
             <span class="filter-prop">Brands</span>
             <i class="fas fa-chevron-right"></i>
           </li>
           <span class="filter-result result-brands"
           >${
             actualySelectedBrands.length > 0
               ? `Selected brands:
           ${actualySelectedBrands.join(", ")}`
               : ""
           }</span
            >
           <li>
           <span class="filter-prop">Colors</span>
           <i class="fas fa-chevron-right"></i>
           </li>
           <span class="filter-result result-colors"
           >${
             actualySelectedColors.length > 0
               ? `Selected colors:
           ${actualySelectedColors.join(", ")}`
               : ""
           }</span
           >
         </ul>
         <div class="filter-buttons">
           <button class="filter-save">Save</button>
           <button class="filter-clear">Clear Filters</button>
         </div>
       </div>
     </div>
   </div>
   <div class="filter-mobile__screen prop" data-visible="false">
     <div class="screen-container">
       <div class="screen-header">
         <i class="fas fa-chevron-left"></i>
         <span class="screen-heading"></span> 
         <i class="fas fa-window-close"></i>
       </div>
       <div class="screen-body"></div>
     </div>
   </div>

    `;
  },
};
