export const getProduct = (id, selectedSize) => {
  const products = JSON.parse(localStorage.getItem("products"));
  const selectedProduct = products.find((product) => product._id === id);
  selectedProduct.countInStock = selectedProduct.countInStock.find(
    (product) => product.size == selectedSize
  );
  return selectedProduct;
};

export const saveInLocalStorage = (localStorageKey, items) => {
  localStorage.setItem(localStorageKey, JSON.stringify(items));
};

export const getItemsFromLocalStorage = (localStorageKey) => {
  return localStorage.getItem(localStorageKey)
    ? JSON.parse(localStorage.getItem(localStorageKey))
    : [];
};

export const removeItemFromStorage = (localStorageKey, item) => {
  let selectedStorageItems = getItemsFromLocalStorage(localStorageKey)
    ? getItemsFromLocalStorage(localStorageKey)
    : [];
  if (selectedStorageItems.length > 0) {
    if (selectedStorageItems.includes(item)) {
      selectedStorageItems = selectedStorageItems.filter(
        (selItem) => selItem !== item
      );
      saveInLocalStorage(localStorageKey, selectedStorageItems);
    }
  }
};
