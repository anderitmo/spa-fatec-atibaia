(async function () {
  const productsContainer = document.querySelector("[data-products]");
  const categoryTitle = document.querySelector("[data-category-title]");
  const categoryTabs = document.querySelector("[data-category-tabs]");
  const loadingState = document.querySelector("[data-loading]");
  const errorState = document.querySelector("[data-error]");
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get("categoria") || "todas";

  const categories = [
    { value: "todas", label: "Todas" },
    { value: "eletrica", label: "Eletricas" },
    { value: "acustica", label: "Acusticas" },
    { value: "baixo", label: "Baixos" },
    { value: "classica", label: "Classicas" }
  ];

  function getCategoryHref(category) {
    return category === "todas" ? "categorias.html" : `categorias.html?categoria=${category}`;
  }

  function renderTabs() {
    categoryTabs.innerHTML = categories.map((category) => {
      const isActive = category.value === selectedCategory;
      const className = [
        "rounded px-4 py-2 text-sm font-bold transition",
        isActive ? "bg-stone-950 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-stone-950"
      ].join(" ");

      return `<a href="${getCategoryHref(category.value)}" class="${className}">${category.label}</a>`;
    }).join("");
  }

  function renderProductCard(product) {
    return `
      <article class="grid overflow-hidden rounded border border-stone-200 bg-white shadow-sm md:grid-cols-[220px_1fr]">
        <a href="produto.html?id=${product.id}" class="bg-stone-100">
          <img src="${product.imagem}" alt="${window.AppUI.escapeHtml(product.nome)}" class="h-full min-h-56 w-full object-cover">
        </a>
        <div class="flex flex-col p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-amber-700">${window.AppUI.escapeHtml(product.marca)}</p>
              <h2 class="mt-1 text-xl font-bold text-stone-950">${window.AppUI.escapeHtml(product.nome)}</h2>
            </div>
            <strong class="text-lg text-stone-950">${window.AppUI.formatCurrency(product.preco)}</strong>
          </div>
          <p class="mt-3 text-sm leading-6 text-stone-600">${window.AppUI.escapeHtml(product.descricao)}</p>
          <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
            <span class="text-sm font-semibold text-stone-500">${product.estoque} em estoque</span>
            <a href="produto.html?id=${product.id}" class="inline-flex items-center gap-2 rounded bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950">
              Ver produto
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  try {
    renderTabs();
    const response = await fetch("../shared/data/guitarras.json");

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar o catalogo.");
    }

    const products = await response.json();
    const visibleProducts = selectedCategory === "todas"
      ? products
      : products.filter((product) => product.categoria === selectedCategory);
    const currentCategory = categories.find((category) => category.value === selectedCategory);

    categoryTitle.textContent = currentCategory ? currentCategory.label : "Todas";
    productsContainer.innerHTML = visibleProducts.length
      ? visibleProducts.map(renderProductCard).join("")
      : `<p class="rounded border border-stone-200 bg-white p-6 text-stone-600">Nenhum produto encontrado nesta categoria.</p>`;

    loadingState.classList.add("hidden");
    window.AppUI.renderIcons();
  } catch (error) {
    console.error(error);
    loadingState.classList.add("hidden");
    errorState.classList.remove("hidden");
  }
})();
