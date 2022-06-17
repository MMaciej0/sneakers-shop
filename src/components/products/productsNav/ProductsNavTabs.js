export const ProductsNavTabs = {
  after_render: () => {},
  render: () => {
    const sortMethod = getItemsFromLocalStorage("sortMethod");
    const selectedBrands = getItemsFromLocalStorage("brands");
    const selectedColors = getItemsFromLocalStorage("colors");
    return `
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
