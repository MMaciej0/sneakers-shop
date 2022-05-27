import { detailsBtnControl } from "./ProductsDetails.js";
import {
  getItemsFromLocalStorage,
  getProduct,
  saveInLocalStorage,
} from "../../../localStorage.js";
import { renderProductsInOrder } from "../ProdcutsNav.js";
import {
  checkIfInCart,
  convertImageSrcToArray,
  getSingleBagButton,
  rerender,
  resetBagBtnsAndSizeBtns,
  setCartValues,
  showCart,
} from "../../../utils.js";

const bagBtnControl = (bagBtn) => {
  const id = bagBtn.dataset.id;
  bagBtn.addEventListener("click", (e) => {
    const selectedBagButton = e.target;
    selectedBagButton.innerText = "In Cart";
    selectedBagButton.disabled = true;
    // add product to cart
    const selectedSizeBtn = document.querySelector('[data-selected="true"]');
    const size = selectedSizeBtn.innerText;
    const cartItem = { ...getProduct(id, size), amount: 1 };
    let cart = getItemsFromLocalStorage("cart");
    cart = [...cart, cartItem];
    // save cart in local storage
    saveInLocalStorage("cart", cart);
    // set cart values
    setCartValues(cart);
    // display cart item
    displayCartItem(cartItem);
    // show the cart
    showCart();
  });
};

export const displayCartItem = (item) => {
  let imagesArray = convertImageSrcToArray(item.image);
  let cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.innerHTML = `
      <img src=${imagesArray[0]} alt=${item.name}/>
      <div>
          <h4>${item.name}</h4>
          <h4>${item.brand}</h4>
          <h4>Size: <span class="item-size">${item.countInStock.size}</span></h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id=${item._id}>remove</span>
      </div>
      <div class="item-qty">
          <i class="fas fa-chevron-up" data-id=${item._id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item._id}></i>
      </div>
      `;
  document.querySelector(".cart-content").appendChild(cartItem);
};

const sizeBtnControl = (selectedBtns) => {
  selectedBtns.addEventListener("click", (e) => {
    resetBagBtnsAndSizeBtns();
    // add selection on size btn (set data-selected=true)
    const sizeBtn = e.target;
    sizeBtn.setAttribute("data-selected", true);
    // check if selected size button (product with that size) is in cart
    const productId = e.target.dataset.id;
    const productSize = sizeBtn.innerText;
    const cart = getItemsFromLocalStorage("cart");
    const actuallyInCart = checkIfInCart(productId, productSize, cart);
    // set proper bag btn inner txt
    const bagBtn = getSingleBagButton(productId);
    if (actuallyInCart) {
      bagBtn.innerText = "In Cart";
      bagBtn.disabled = true;
    } else {
      bagBtn.disabled = false;
      bagBtn.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
    }
  });
};

export const ProductsItems = {
  after_render: () => {
    const bagButtons = document.querySelectorAll(".bag-btn");
    bagButtons.forEach((button) => bagBtnControl(button));
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach((button) => sizeBtnControl(button));
    const detailsButtons = document.querySelectorAll(".details-btn");
    detailsButtons.forEach((button) => detailsBtnControl(button));
  },
  render: async () => {
    const selectedSortMethod = getItemsFromLocalStorage("sortMethod");
    const selectedProducts = await renderProductsInOrder(selectedSortMethod);
    return selectedProducts.length === 0
      ? `<h2>Sorry, we don't have sneakers, you looking for :(</h2>`
      : `
        ${selectedProducts
          .map(
            (product) => `
        <article class="product">
        <div class="img-container">
        <span id="color" style="background-color: ${product.color}"></span>
          ${
            Array.isArray(product.image)
              ? `<img src=${product.image[0]} alt=${product.name} class="product-img"/>`
              : `<img src=${product.image} alt=${product.name} class="product-img"/>`
          }
          <div class="buttons-container">
              <button class="details-btn" data-id=${
                product._id
              }>show details</button>
              <button disabled class="bag-btn" data-id=${
                product._id
              }><i class="fas fa-shopping-cart"></i>add to bag</button> 
          </div>
          <div class="size-container">
              ${product.countInStock
                .map((item) =>
                  item.qty == 0
                    ? `<button disabled data-id=${product._id} data-selected="false" class="size-btn">${item.size}</button>`
                    : `<button data-id=${product._id} data-selected="false" class="size-btn">${item.size}</button>`
                )
                .join("")}
          </div>
          </div>
          <h3>${product.name}</h3>
          <h3 id="brand">${product.brand}</h3>
          <h4 id="price">$${product.price}</h4>
        </article>
        `
          )
          .join("")}
        `;
  },
};
