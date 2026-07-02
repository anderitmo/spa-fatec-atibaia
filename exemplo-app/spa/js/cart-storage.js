(function () {
  const CART_KEY = "guitarras-app-cart";

  function readCart() {
    const rawCart = localStorage.getItem(CART_KEY);

    if (!rawCart) {
      return [];
    }

    try {
      const cart = JSON.parse(rawCart);
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      console.warn("Carrinho invalido no localStorage. Reiniciando carrinho.", error);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function normalizeQty(quantity) {
    const parsedQuantity = Number(quantity);
    return Number.isFinite(parsedQuantity) ? Math.max(0, Math.floor(parsedQuantity)) : 0;
  }

  function normalizeItem(product, quantity) {
    return {
      id: product.id,
      nome: product.nome,
      marca: product.marca,
      preco: product.preco,
      imagem: product.imagem,
      estoque: product.estoque,
      quantidade: normalizeQty(quantity)
    };
  }

  function getCart() {
    return readCart();
  }

  function addItem(product, quantity = 1) {
    const quantityToAdd = normalizeQty(quantity);

    if (!product || product.id === undefined || quantityToAdd < 1) {
      return getCart();
    }

    const cart = getCart();
    const existingItem = cart.find((item) => String(item.id) === String(product.id));

    if (existingItem) {
      existingItem.quantidade = normalizeQty(existingItem.quantidade) + quantityToAdd;
    } else {
      cart.push(normalizeItem(product, quantityToAdd));
    }

    saveCart(cart);
    return cart;
  }

  function removeItem(productId) {
    const cart = getCart().filter((item) => String(item.id) !== String(productId));
    saveCart(cart);
    return cart;
  }

  function updateQty(productId, quantity) {
    const newQuantity = normalizeQty(quantity);

    if (newQuantity < 1) {
      return removeItem(productId);
    }

    const cart = getCart().map((item) => {
      if (String(item.id) !== String(productId)) {
        return item;
      }

      return {
        ...item,
        quantidade: newQuantity
      };
    });

    saveCart(cart);
    return cart;
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    return [];
  }

  function getTotal() {
    return getCart().reduce((total, item) => {
      const price = Number(item.preco) || 0;
      const quantity = normalizeQty(item.quantidade);
      return total + price * quantity;
    }, 0);
  }

  window.CartStorage = {
    getCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getTotal
  };
})();
