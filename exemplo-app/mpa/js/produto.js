(async function () {
  const productContainer = document.querySelector("[data-product-detail]");
  const loadingState = document.querySelector("[data-loading]");
  const errorState = document.querySelector("[data-error]");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  function renderProduct(product) {
    productContainer.innerHTML = `
      <section class="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div class="overflow-hidden rounded border border-stone-200 bg-stone-100">
          <img src="${product.imagem}" alt="${window.AppUI.escapeHtml(product.nome)}" class="aspect-[4/3] w-full object-cover">
        </div>
        <div>
          <a href="categorias.html?categoria=${product.categoria}" class="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:text-stone-950">
            <i data-lucide="tag" class="h-4 w-4"></i>
            ${window.AppUI.escapeHtml(product.categoria)}
          </a>
          <p class="mt-6 text-sm font-bold uppercase tracking-wide text-amber-700">${window.AppUI.escapeHtml(product.marca)}</p>
          <h1 class="mt-2 text-3xl font-black text-stone-950 md:text-5xl">${window.AppUI.escapeHtml(product.nome)}</h1>
          <p class="mt-5 text-base leading-7 text-stone-600">${window.AppUI.escapeHtml(product.descricao)}</p>
          <div class="mt-6 rounded border border-stone-200 bg-white p-5">
            <p class="text-sm font-bold uppercase tracking-wide text-stone-500">Preco</p>
            <p class="mt-1 text-3xl font-black text-stone-950">${window.AppUI.formatCurrency(product.preco)}</p>
            <p class="mt-2 text-sm font-semibold text-stone-500">${product.estoque} unidades em estoque</p>
            <button data-add-to-cart class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-amber-500 px-5 py-3 text-sm font-black text-stone-950 transition hover:bg-amber-400">
              <i data-lucide="shopping-cart" class="h-5 w-5"></i>
              Adicionar ao carrinho
            </button>
          </div>
          <dl class="mt-6 grid gap-3 rounded border border-stone-200 bg-white p-5 text-sm">
            <div class="flex items-center justify-between gap-4">
              <dt class="font-bold text-stone-500">Cordas</dt>
              <dd class="text-stone-950">${product.especificacoes.cordas}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-bold text-stone-500">Material</dt>
              <dd class="text-right text-stone-950">${window.AppUI.escapeHtml(product.especificacoes.material)}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-bold text-stone-500">Captadores</dt>
              <dd class="text-right text-stone-950">${window.AppUI.escapeHtml(product.especificacoes.captadores)}</dd>
            </div>
          </dl>
        </div>
      </section>
    `;

    productContainer.querySelector("[data-add-to-cart]").addEventListener("click", () => {
      window.CartStorage.addItem(product, 1);
      window.AppUI.updateCartCount();
      productContainer.querySelector("[data-add-to-cart]").innerHTML = `
        <i data-lucide="check" class="h-5 w-5"></i>
        Adicionado
      `;
      window.AppUI.renderIcons();
    });
  }

  try {
    if (!productId) {
      throw new Error("Produto nao informado.");
    }

    const response = await fetch("../shared/data/guitarras.json");

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar o catalogo.");
    }

    const products = await response.json();
    const product = products.find((item) => String(item.id) === String(productId));

    if (!product) {
      throw new Error("Produto nao encontrado.");
    }

    renderProduct(product);
    loadingState.classList.add("hidden");
    window.AppUI.renderIcons();
  } catch (error) {
    console.error(error);
    loadingState.classList.add("hidden");
    errorState.classList.remove("hidden");
  }
})();
