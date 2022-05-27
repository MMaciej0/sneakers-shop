import { Products } from "../components/products/Products.js";

const HomeScreen = {
  after_render: () => {
    Products.after_render();
  },
  render: async () => {
    const productsDOM = await Products.render();

    return `
  <!-- navbar -->
  <!-- end of navbar -->
  <!-- cart -->
  <!-- end of cart -->
  <!-- hero -->
  <div class="hero">
    <div class="banner">
      <h1 class="banner-title">sneakers collection</h1>
      <a href="#products" class="banner-btn">sneaker now</a>
    </div>
  </div>
  <!-- end of hero -->
  <!-- products -->
  <section id="products" class="products">
    <div class="section-title">
      <h2>our products</h2>
    </div>
  <!-- products, added dynamically -->
    ${productsDOM}
  <!-- end of products -->
  </section>
  <!-- end of products -->
  `;
  },
};

export default HomeScreen;
