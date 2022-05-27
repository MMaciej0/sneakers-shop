export const getProducts = async () => {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    const products = data.products;
    return products;
  } catch (error) {
    console.log(error);
  }
};
