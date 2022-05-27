import { getProducts } from "../api.js";
import {
  getItemsFromLocalStorage,
  saveInLocalStorage,
} from "../localStorage.js";
import {
  checkIfInCart,
  hideCart,
  populateCart,
  removeChilds,
  resetBagBtnsAndSizeBtns,
  setCartValues,
  showCart,
} from "../utils.js";

// main function to control remove, increase and decrease buttons
const cartBtnsControl = (button) => {
  if (button.target.classList.contains("remove-item")) {
    const removeBtn = button.target;
    const itemId = removeBtn.dataset.id;
    const itemSize = findItemSize(removeBtn);
    removeItem(itemId, itemSize);
    document
      .querySelector(".cart-content")
      .removeChild(removeBtn.parentElement.parentElement);
  } else if (button.target.classList.contains("fa-chevron-up")) {
    const addAmount = button.target;
    const itemId = addAmount.dataset.id;
    const itemSize = findItemSize(addAmount);
    let cart = getItemsFromLocalStorage("cart");
    const tempItem = checkIfInCart(itemId, itemSize, cart);
    if (tempItem.amount < tempItem.countInStock.qty) {
      cart.splice(findObjectIndexByProps(cart, itemId, itemSize), 1);
      tempItem.amount++;
      cart = [...cart, tempItem];
      saveInLocalStorage("cart", cart);
      setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.amount;
    } else {
      const container = addAmount.parentElement;
      const message = document.createElement("div");
      message.classList.add("item-message");
      message.innerText = "Sorry, it's all we have.";
      container.appendChild(message);
      setTimeout(() => {
        const message = document.querySelector(".item-message");
        if (message) container.removeChild(message);
      }, 1000);
    }
  } else if (button.target.classList.contains("fa-chevron-down")) {
    const decreaseAmount = button.target;
    const itemId = decreaseAmount.dataset.id;
    const itemSize = findItemSize(decreaseAmount);
    let cart = getItemsFromLocalStorage("cart");
    const tempItem = checkIfInCart(itemId, itemSize, cart);
    if (tempItem.amount === 1) {
      removeItem(itemId, itemSize);
      document
        .querySelector(".cart-content")
        .removeChild(decreaseAmount.parentElement.parentElement);
    } else {
      cart.splice(findObjectIndexByProps(cart, itemId, itemSize), 1);
      tempItem.amount--;
      cart = [...cart, tempItem];
      saveInLocalStorage("cart", cart);
      setCartValues(cart);
      decreaseAmount.previousElementSibling.innerText = tempItem.amount;
    }
  }
};

const findObjectIndexByProps = (array, id, size) => {
  let output;
  const arr = array.map((item) => ({
    id: item._id,
    size: item.countInStock.size,
  }));
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["id"] == id && arr[i]["size"] == size) {
      output = i;
    }
  }
  return output;
};

const clearCart = () => {
  let cart = getItemsFromLocalStorage("cart");
  const cartContent = document.querySelector(".cart-content");
  const items = cart.map((item) => ({
    id: item._id,
    size: item.countInStock.size,
  }));
  items.forEach((item) => removeItem(item.id, item.size));
  while (cartContent.children.length > 0) {
    removeChilds(cartContent);
  }
  resetBagBtnsAndSizeBtns();
  hideCart();
};

const removeItem = (id, size) => {
  let cart = getItemsFromLocalStorage("cart");
  cart.splice(findObjectIndexByProps(cart, id, size), 1);
  saveInLocalStorage("cart", cart);
  setCartValues(cart);
  resetBagBtnsAndSizeBtns();
  if (cart) {
    if (cart.length < 1) {
      hideCart();
    }
  }
};

const findItemSize = (DOMElement) => {
  const itemContainer = DOMElement.parentElement.parentElement;
  return itemContainer.querySelector(".item-size").innerText;
};

const setupAPP = async () => {
  const products = await getProducts();
  saveInLocalStorage("products", products);
  const cart = getItemsFromLocalStorage("cart");
  setCartValues(cart);
  populateCart(cart);
};

export const Header = {
  after_render: async () => {
    await setupAPP();
    document.querySelector(".close-cart").addEventListener("click", hideCart);
    document.querySelector(".cart-btn").addEventListener("click", showCart);
    document.querySelector(".clear-cart").addEventListener("click", clearCart);
    document
      .querySelector(".cart-content")
      .addEventListener("click", (e) => cartBtnsControl(e));
    document
      .querySelector(".cart-empty > a")
      .addEventListener("click", hideCart);
  },
  render: () => {
    return `
      <nav class="navbar">
        <div class="navbar-center">
          <span class="nav-icon">
            <i class="fas fa-bars"></i>
          </span>
          <img src="./images/logo.svg" alt="shop logo" />
          <div class="cart-btn">
            <span class="nav-icon">
              <i class="fas fa-cart-plus"></i>
            </span>
            <div class="cart-items">0</div>
          </div>
        </div>
      </nav>
    <div class="overlay overlay-cart">
      <div class="cart">
        <span class="close-cart">
          <i class="fas fa-window-close"></i>
        </span>
        <h2>your cart</h2>
        <span class="cart-empty">Your cart is empty. <a href="#products">Go grab your new sneakers!</a></span>
        <div class="cart-content">
          <!-- cart item -->
          <!-- end of cart item -->
        </div>
        <div class="cart-footer none">
          <h3>your total: $ <span class="cart-total">0</span></h3>
          <button class="clear-cart banner-btn">clear cart</button>
        </div>
      </div>
    </div>
        `;
  },
};
