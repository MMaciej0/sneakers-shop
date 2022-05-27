import { displayCartItem } from "./components/products/productsItems/ProductsItems.js";
import { getItemsFromLocalStorage } from "./localStorage.js";

export const resetBagBtnsAndSizeBtns = () => {
  // set default state to bagBtns (disabled and "add to bag" inner txt)
  const bagBtns = document.querySelectorAll(".bag-btn");
  bagBtns.forEach((button) => {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
  });
  // reset selection on size buttons
  const previouslySelectedBtn = document.querySelector(
    '[data-selected="true"]'
  );
  if (previouslySelectedBtn) {
    previouslySelectedBtn.setAttribute("data-selected", false);
  }
};

export const checkIfInCart = (productId, size, cart) => {
  return cart
    .filter((item) => item._id === productId)
    .find((item) => item.countInStock.size == size);
};

export const setCartValues = (cart) => {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });
  document.querySelector(".cart-items").innerText = itemsTotal;
  const cartTotal = document.querySelector(".cart-total");

  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
};

export const showCart = () => {
  document.querySelector(".overlay").classList.add("showBcg");
  document.querySelector(".cart").classList.add("showCart");
  document.body.style.overflow = "hidden";
  const cart = getItemsFromLocalStorage("cart");
  const cartFooter = document.querySelector(".cart-footer");
  const cartEmptyMessage = document.querySelector(".cart-empty");
  if (cart) {
    if (cart.length > 0) {
      cartFooter.classList.remove("none");
      cartEmptyMessage.classList.add("none");
    } else {
      cartFooter.classList.add("none");
      cartEmptyMessage.classList.remove("none");
    }
  }
};

export const hideCart = () => {
  document.querySelector(".overlay").classList.remove("showBcg");
  document.querySelector(".cart").classList.remove("showCart");
  document.body.style.overflow = "visible";
};

export const populateCart = (cart) => {
  cart.forEach((item) => displayCartItem(item));
};

export const getSingleBagButton = (id) => {
  const buttonsDOM = [...document.querySelectorAll(".bag-btn")];
  return buttonsDOM.find((button) => button.dataset.id === id);
};

export const convertImageSrcToArray = (value) => {
  let output = [];
  if (Array.isArray(value)) {
    output = value;
  } else {
    const splited = String(value).split(" ");
    output = Array.from(splited);
  }
  return output;
};

export const removeChilds = (parent) => {
  while (parent.children.length > 0) {
    parent.removeChild(parent.children[0]);
  }
};

export const rerender = async (container, component) => {
  container.innerHTML = await component.render();
  await component.after_render();
};
