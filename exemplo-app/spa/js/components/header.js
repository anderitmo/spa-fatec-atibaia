import { getCartCount, renderIcons } from "../utils.js";

const LOAD_COUNT_KEY = "guitarras-app-spa-page-loads";

function getFullPageLoads() {
  return Number(sessionStorage.getItem(LOAD_COUNT_KEY)) || 0;
}

function navClass(isActive) {
  return [
    "rounded px-3 py-2 text-sm font-semibold transition",
    isActive ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
  ].join(" ");
}

function getCurrentRoute() {
  const route = window.location.hash.slice(1) || "/";
  return route.split("?")[0];
}

export function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((counter) => {
    counter.textContent = getCartCount();
  });
}

export function renderHeader() {
  const header = document.querySelector("[data-spa-header]");

  if (!header) {
    return;
  }

  const currentRoute = getCurrentRoute();

  header.innerHTML = `
    <header class="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <a href="#/" class="flex items-center gap-3 text-stone-950">
          <span class="flex h-10 w-10 items-center justify-center rounded bg-amber-500 text-stone-950">
            <i data-lucide="guitar" class="h-5 w-5"></i>
          </span>
          <span>
            <span class="block text-base font-bold leading-tight">Guitar Shop</span>
            <span class="block text-xs font-medium uppercase tracking-wide text-stone-500">Versao SPA</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 md:flex" aria-label="Navegacao principal">
          <a href="#/" class="${navClass(currentRoute === "/")}">Home</a>
          <a href="#/categorias" class="${navClass(currentRoute === "/categorias")}">Categorias</a>
          <a href="#/cadastro" class="${navClass(currentRoute === "/cadastro")}">Cadastro</a>
        </nav>

        <a href="#/carrinho" class="relative inline-flex h-10 w-10 items-center justify-center rounded border border-stone-300 bg-white text-stone-800 transition hover:border-amber-500 hover:text-stone-950" aria-label="Abrir carrinho">
          <i data-lucide="shopping-cart" class="h-5 w-5"></i>
          <span data-cart-count class="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-stone-950">${getCartCount()}</span>
        </a>
      </div>

      <div class="border-t border-stone-100">
        <div class="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide text-stone-500">
          <i data-lucide="refresh-cw" class="h-4 w-4 text-amber-600"></i>
          Page loads completos: ${getFullPageLoads()}
        </div>
      </div>

      <div class="border-t border-stone-100 md:hidden">
        <nav class="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2" aria-label="Navegacao mobile">
          <a href="#/" class="${navClass(currentRoute === "/")}">Home</a>
          <a href="#/categorias" class="${navClass(currentRoute === "/categorias")}">Categorias</a>
          <a href="#/cadastro" class="${navClass(currentRoute === "/cadastro")}">Cadastro</a>
        </nav>
      </div>
    </header>
  `;

  renderIcons();
}
