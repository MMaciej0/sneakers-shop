import { Products } from "../components/products/Products.js";

const HomeScreen = {
  after_render: () => {
    Products.after_render();
  },
  render: async () => {
    const productsDOM = await Products.render();

    return `
  <div class="hero">
    <div class="banner">
      <h1 class="banner-title">sneakers collection</h1>
      <a href="#products" class="banner-btn">sneaker now</a>
    </div>
  </div>
  <div id="products" class="products">
    <div class="section-title">
      <h2>our products</h2>
    </div>
    <div id="products-content">
    ${productsDOM}
    </div>
  </div>
  `;
  },
};

export default HomeScreen;
