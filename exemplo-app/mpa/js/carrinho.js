(function () {
  const cartContainer = document.querySelector("[data-cart]");
  const totalContainer = document.querySelector("[data-cart-total]");
  const clearButton = document.querySelector("[data-clear-cart]");

  function renderCart() {
    const cart = window.CartStorage.getCart();

    if (!cart.length) {
      cartContainer.innerHTML = `
        <div class="rounded border border-stone-200 bg-white p-8 text-center">
          <i data-lucide="shopping-bag" class="mx-auto h-10 w-10 text-stone-400"></i>
          <h2 class="mt-4 text-xl font-bold text-stone-950">Seu carrinho esta vazio</h2>
          <p class="mt-2 text-sm text-stone-600">Escolha uma guitarra no catalogo para iniciar a demonstracao.</p>
          <a href="categorias.html" class="mt-5 inline-flex items-center gap-2 rounded bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950">
            Ver catalogo
            <i data-lucide="arrow-right" class="h-4 w-4"></i>
          </a>
        </div>
      `;
      totalContainer.textContent = window.AppUI.formatCurrency(0);
      clearButton.disabled = true;
      window.AppUI.updateCartCount();
      window.AppUI.renderIcons();
      return;
    }

    clearButton.disabled = false;
    cartContainer.innerHTML = cart.map((item) => `
      <article class="grid gap-4 rounded border border-stone-200 bg-white p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
        <img src="${item.imagem}" alt="${window.AppUI.escapeHtml(item.nome)}" class="aspect-square w-full rounded bg-stone-100 object-cover md:w-28">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-amber-700">${window.AppUI.escapeHtml(item.marca)}</p>
          <h2 class="mt-1 text-lg font-bold text-stone-950">${window.AppUI.escapeHtml(item.nome)}</h2>
          <p class="mt-2 text-sm font-semibold text-stone-500">${window.AppUI.formatCurrency(item.preco)} cada</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 md:justify-end">
          <label class="text-sm font-bold text-stone-600" for="qty-${item.id}">Qtd.</label>
          <input id="qty-${item.id}" data-qty="${item.id}" type="number" min="1" value="${item.quantidade}" class="h-10 w-20 rounded border border-stone-300 px-3 text-sm font-bold text-stone-950">
          <button data-remove="${item.id}" class="inline-flex h-10 w-10 items-center justify-center rounded border border-stone-300 text-stone-700 transition hover:border-red-500 hover:text-red-600" aria-label="Remover ${window.AppUI.escapeHtml(item.nome)}">
            <i data-lucide="trash-2" class="h-5 w-5"></i>
          </button>
        </div>
      </article>
    `).join("");

    totalContainer.textContent = window.AppUI.formatCurrency(window.CartStorage.getTotal());
    bindCartEvents();
    window.AppUI.updateCartCount();
    window.AppUI.renderIcons();
  }

  function bindCartEvents() {
    cartContainer.querySelectorAll("[data-qty]").forEach((input) => {
      input.addEventListener("change", () => {
        window.CartStorage.updateQty(input.dataset.qty, input.value);
        renderCart();
      });
    });

    cartContainer.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        window.CartStorage.removeItem(button.dataset.remove);
        renderCart();
      });
    });
  }

  clearButton.addEventListener("click", () => {
    window.CartStorage.clearCart();
    renderCart();
  });

  renderCart();
})();
