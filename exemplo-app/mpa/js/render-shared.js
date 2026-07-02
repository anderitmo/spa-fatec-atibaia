(function () {
  const categories = [
    { label: "Eletricas", href: "categorias.html?categoria=eletrica" },
    { label: "Acusticas", href: "categorias.html?categoria=acustica" },
    { label: "Baixos", href: "categorias.html?categoria=baixo" },
    { label: "Classicas", href: "categorias.html?categoria=classica" }
  ];
  const LOAD_COUNT_KEY = "guitarras-app-mpa-page-loads";

  function incrementPageLoads() {
    const currentCount = Number(sessionStorage.getItem(LOAD_COUNT_KEY)) || 0;
    const nextCount = currentCount + 1;
    sessionStorage.setItem(LOAD_COUNT_KEY, String(nextCount));
    return nextCount;
  }

  const fullPageLoads = incrementPageLoads();

  function getCartCount() {
    if (!window.CartStorage) {
      return 0;
    }

    return window.CartStorage.getCart().reduce((total, item) => total + (Number(item.quantidade) || 0), 0);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(Number(value) || 0);
  }

  function renderIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderHeader() {
    const header = document.querySelector("[data-shared-header]");

    if (!header) {
      return;
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const cartCount = getCartCount();

    header.innerHTML = `
      <header class="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <a href="index.html" class="flex items-center gap-3 text-stone-950">
            <span class="flex h-10 w-10 items-center justify-center rounded bg-amber-500 text-stone-950">
              <i data-lucide="guitar" class="h-5 w-5"></i>
            </span>
            <span>
              <span class="block text-base font-bold leading-tight">Guitar Shop</span>
              <span class="block text-xs font-medium uppercase tracking-wide text-stone-500">Versao MPA</span>
            </span>
          </a>

          <nav class="hidden items-center gap-1 md:flex" aria-label="Navegacao principal">
            <a href="index.html" class="${navClass(currentPage === "index.html")}">Home</a>
            <a href="categorias.html" class="${navClass(currentPage === "categorias.html")}">Categorias</a>
            <a href="cadastro.html" class="${navClass(currentPage === "cadastro.html")}">Cadastro</a>
          </nav>

          <a href="carrinho.html" class="relative inline-flex h-10 w-10 items-center justify-center rounded border border-stone-300 bg-white text-stone-800 transition hover:border-amber-500 hover:text-stone-950" aria-label="Abrir carrinho">
            <i data-lucide="shopping-cart" class="h-5 w-5"></i>
            <span data-cart-count class="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-stone-950">${cartCount}</span>
          </a>
        </div>

        <div class="border-t border-stone-100">
          <div class="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide text-stone-500">
            <i data-lucide="refresh-cw" class="h-4 w-4 text-amber-600"></i>
            Page loads completos: ${fullPageLoads}
          </div>
        </div>

        <div class="border-t border-stone-100 md:hidden">
          <nav class="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2" aria-label="Navegacao mobile">
            <a href="index.html" class="${navClass(currentPage === "index.html")}">Home</a>
            <a href="categorias.html" class="${navClass(currentPage === "categorias.html")}">Categorias</a>
            <a href="cadastro.html" class="${navClass(currentPage === "cadastro.html")}">Cadastro</a>
          </nav>
        </div>
      </header>
    `;
  }

  function navClass(isActive) {
    return [
      "rounded px-3 py-2 text-sm font-semibold transition",
      isActive ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
    ].join(" ");
  }

  function renderFooter() {
    const footer = document.querySelector("[data-shared-footer]");

    if (!footer) {
      return;
    }

    footer.innerHTML = `
      <footer class="border-t border-stone-200 bg-stone-950 text-white">
        <div class="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p class="text-lg font-bold">Guitar Shop</p>
            <p class="mt-2 max-w-xl text-sm leading-6 text-stone-300">E-commerce didatico para comparar navegacao Multi Page e Single Page mantendo o mesmo conteudo e a mesma identidade visual.</p>
          </div>
          <div>
            <p class="text-sm font-bold uppercase tracking-wide text-amber-300">Categorias</p>
            <div class="mt-3 flex flex-wrap gap-2">
              ${categories.map((category) => `<a href="${category.href}" class="rounded border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-amber-300 hover:text-white">${category.label}</a>`).join("")}
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function updateCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach((counter) => {
      counter.textContent = getCartCount();
    });
  }

  function renderShared() {
    renderHeader();
    renderFooter();
    renderIcons();
  }

  window.AppUI = {
    escapeHtml,
    formatCurrency,
    renderIcons,
    renderShared,
    updateCartCount
  };

  renderShared();
})();
