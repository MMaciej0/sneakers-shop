export const ProductsNavDesktop = {
  after_render: () => {},
  render: () => {
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
        `;
  },
};
