import { getProducts } from "../../../api.js";
import { convertImageSrcToArray } from "../../../utils.js";

export const detailsBtnControl = async (detailBtn) => {
  const products = await getProducts();
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("product-details");
  detailBtn.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    // find product by id
    const selectedProduct = products.find((product) => product._id == id);
    const productImgsArray = convertImageSrcToArray(selectedProduct.image);
    const sideSliderImgs = productImgsArray
      .map(
        (img) =>
          `<div class="slider-img"><img src=${img} alt=${selectedProduct.name}/></div>`
      )
      .join("");

    detailsContainer.innerHTML = `
      <span class="close-details">
      <i class="fas fa-window-close"></i>
      </span>
      <div class="side-slider">
      <div class="slider-prev">
      <img src="./images/icon-next.svg"/>
      </div>
      <div class="slider-next">
      <img src="./images/icon-next.svg"/>
      </div>
      ${sideSliderImgs}
      </div>
      <div class="slide">
      <img src=${productImgsArray[0]} alt=${selectedProduct.name}/>
      </div>
      `;
    document.querySelector(".overlay-details").appendChild(detailsContainer);
    // show details
    const overlay = document.querySelector(".products > .overlay");
    overlay.classList.add("showBcg");
    const sliderImgs = document.querySelectorAll(".slider-img");
    sliderImgs[0].classList.add("active");
    // slider functionality
    cauroselSlide();
    // hide details
    document.querySelector(".close-details").addEventListener("click", () => {
      document.querySelector(".overlay-details").removeChild(detailsContainer);
      document
        .querySelector(".products > .overlay")
        .classList.remove("showBcg");
    });
  });
};

const cauroselSlide = () => {
  let windowWidth = window.innerWidth;
  sliderScrolling(windowWidth);
  window.addEventListener("resize", () => {
    windowWidth = window.innerWidth;
    sliderScrolling(windowWidth);
  });

  const sliderImgs = [...document.querySelectorAll(".slider-img > img")];
  sliderImgs.forEach((image) => {
    image.addEventListener("click", (e) => {
      // remove active class
      const activeImg = document.querySelector(".active");
      activeImg.classList.remove("active");
      // add active class to selected img
      const img = e.target;
      img.parentElement.classList.add("active");
      // remove slide image and add selected one
      const slideImg = document.querySelector(".slide > img");
      slideImg.src = img.src;
    });
  });
};

const sliderScrolling = (windowWidth) => {
  const imageContainer = document.querySelector(".slider-img");
  const imageContainerDimensions = imageContainer.getBoundingClientRect();
  const imageContainerWidth = imageContainerDimensions.width;
  const slider = document.querySelector(".side-slider");
  const nextBtn = document.querySelector(".slider-next > img");
  const prevBtn = document.querySelector(".slider-prev > img");
  if (windowWidth < 1024) {
    nextBtn.addEventListener("click", () => {
      slider.scrollLeft += imageContainerWidth;
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollLeft -= imageContainerWidth;
    });
  } else {
    nextBtn.addEventListener("click", () => {
      slider.scrollTop += imageContainerWidth;
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollTop -= imageContainerWidth;
    });
  }
};
