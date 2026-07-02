let productsCache = null;

export async function getProducts() {
  if (productsCache) {
    return productsCache;
  }

  const response = await fetch("../shared/data/guitarras.json");

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o catalogo.");
  }

  productsCache = await response.json();
  return productsCache;
}

export async function getProductById(productId) {
  const products = await getProducts();
  return products.find((product) => String(product.id) === String(productId));
}
