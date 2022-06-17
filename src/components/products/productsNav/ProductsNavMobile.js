import {
  getItemsFromLocalStorage,
  saveInLocalStorage,
} from "../../../localStorage.js";
import { rerender } from "../../../utils.js";
import {
  loadActiveClass,
  removeActiveFromItems,
  removeSelectedItemsFromStorage,
  renderFilterBrands,
  renderFilterColors,
  renderSortMethods,
  saveMultipleSelectionList,
  saveResetFilterBtnsControl,
  saveSortBtnControl,
} from "./ProductsNavReusable.js";

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

const mobileFilterScreenControl = () => {
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
        propBody.innerHTML = await renderFilterBrands();
      } else if (selectedProp === "colors") {
        propHeader.innerText = "Colors";
        propBody.innerHTML = await renderFilterColors();
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
          console.log(selectedProp);
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

export const ProductsNavMobile = {
  after_render: () => {
    const mobileSortBtn = document.querySelector(
      ".filter-mobile__btns > .sort-btn"
    );
    mobileSortBtn.addEventListener("click", mobileSortScreenControl);
    const mobileFilterBtn = document.querySelector(".filter-btn");
    mobileFilterBtn.addEventListener("click", mobileFilterScreenControl);
  },
  render: () => {
    const actualySelectedBrands = getItemsFromLocalStorage("brands");
    const actualySelectedColors = getItemsFromLocalStorage("colors");
    return `
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
    <div
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
