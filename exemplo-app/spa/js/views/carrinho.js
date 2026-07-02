import { updateCartCount } from "../components/header.js";
import { escapeHtml, formatCurrency, renderIcons } from "../utils.js";

function renderCartItems(cart) {
  return cart.map((item) => `
    <article class="grid gap-4 rounded border border-stone-200 bg-white p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
      <img src="${item.imagem}" alt="${escapeHtml(item.nome)}" class="aspect-square w-full rounded bg-stone-100 object-cover md:w-28">
      <div>
        <p class="text-xs font-bold uppercase tracking-wide text-amber-700">${escapeHtml(item.marca)}</p>
        <h2 class="mt-1 text-lg font-bold text-stone-950">${escapeHtml(item.nome)}</h2>
        <p class="mt-2 text-sm font-semibold text-stone-500">${formatCurrency(item.preco)} cada</p>
      </div>
      <div class="flex flex-wrap items-center gap-3 md:justify-end">
        <label class="text-sm font-bold text-stone-600" for="qty-${item.id}">Qtd.</label>
        <input id="qty-${item.id}" data-qty="${item.id}" type="number" min="1" value="${item.quantidade}" class="h-10 w-20 rounded border border-stone-300 px-3 text-sm font-bold text-stone-950">
        <button data-remove="${item.id}" class="inline-flex h-10 w-10 items-center justify-center rounded border border-stone-300 text-stone-700 transition hover:border-red-500 hover:text-red-600" aria-label="Remover ${escapeHtml(item.nome)}">
          <i data-lucide="trash-2" class="h-5 w-5"></i>
        </button>
      </div>
    </article>
  `).join("");
}

function bindCartEvents(app) {
  app.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      window.CartStorage.updateQty(input.dataset.qty, input.value);
      renderCarrinho(app);
    });
  });

  app.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      window.CartStorage.removeItem(button.dataset.remove);
      renderCarrinho(app);
    });
  });

  const clearButton = app.querySelector("[data-clear-cart]");

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      window.CartStorage.clearCart();
      renderCarrinho(app);
    });
  }
}

export function renderCarrinho(app) {
  const cart = window.CartStorage.getCart();
  const cartContent = cart.length
    ? renderCartItems(cart)
    : `
      <div class="rounded border border-stone-200 bg-white p-8 text-center">
        <i data-lucide="shopping-bag" class="mx-auto h-10 w-10 text-stone-400"></i>
        <h2 class="mt-4 text-xl font-bold text-stone-950">Seu carrinho esta vazio</h2>
        <p class="mt-2 text-sm text-stone-600">Escolha uma guitarra no catalogo para iniciar a demonstracao.</p>
        <a href="#/categorias" class="mt-5 inline-flex items-center gap-2 rounded bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950">
          Ver catalogo
          <i data-lucide="arrow-right" class="h-4 w-4"></i>
        </a>
      </div>
    `;

  app.innerHTML = `
    <main class="mx-auto max-w-6xl px-4 py-10">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-amber-700">Compra simulada</p>
          <h1 class="mt-2 text-4xl font-black text-stone-950">Carrinho</h1>
        </div>
        <button data-clear-cart class="inline-flex items-center gap-2 rounded border border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50" ${cart.length ? "" : "disabled"}>
          <i data-lucide="trash-2" class="h-4 w-4"></i>
          Limpar
        </button>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div class="grid gap-4">${cartContent}</div>

        <aside class="rounded border border-stone-200 bg-white p-5">
          <p class="text-sm font-bold uppercase tracking-wide text-stone-500">Resumo</p>
          <div class="mt-4 flex items-center justify-between gap-4 border-t border-stone-200 pt-4">
            <span class="font-bold text-stone-700">Total</span>
            <strong class="text-2xl font-black text-stone-950">${formatCurrency(window.CartStorage.getTotal())}</strong>
          </div>
          <a href="#/cadastro" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-amber-500 px-4 py-3 text-sm font-black text-stone-950 transition hover:bg-amber-400">
            Finalizar cadastro
            <i data-lucide="arrow-right" class="h-4 w-4"></i>
          </a>
        </aside>
      </div>
    </main>
  `;

  bindCartEvents(app);
  updateCartCount();
  renderIcons();
}
