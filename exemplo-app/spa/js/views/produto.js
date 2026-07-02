import { updateCartCount } from "../components/header.js";
import { getProductById } from "../services/api.js";
import { escapeHtml, formatCurrency, renderIcons } from "../utils.js";

export async function renderProduto(app, productId) {
  const product = await getProductById(productId);

  if (!product) {
    throw new Error("Produto nao encontrado.");
  }

  app.innerHTML = `
    <main class="mx-auto max-w-6xl px-4 py-10">
      <a href="#/categorias" class="mb-6 inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:text-stone-950">
        <i data-lucide="arrow-left" class="h-4 w-4"></i>
        Voltar ao catalogo
      </a>

      <section class="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div class="overflow-hidden rounded border border-stone-200 bg-stone-100">
          <img src="${product.imagem}" alt="${escapeHtml(product.nome)}" class="aspect-[4/3] w-full object-cover">
        </div>
        <div>
          <a href="#/categorias?categoria=${product.categoria}" class="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:text-stone-950">
            <i data-lucide="tag" class="h-4 w-4"></i>
            ${escapeHtml(product.categoria)}
          </a>
          <p class="mt-6 text-sm font-bold uppercase tracking-wide text-amber-700">${escapeHtml(product.marca)}</p>
          <h1 class="mt-2 text-3xl font-black text-stone-950 md:text-5xl">${escapeHtml(product.nome)}</h1>
          <p class="mt-5 text-base leading-7 text-stone-600">${escapeHtml(product.descricao)}</p>
          <div class="mt-6 rounded border border-stone-200 bg-white p-5">
            <p class="text-sm font-bold uppercase tracking-wide text-stone-500">Preco</p>
            <p class="mt-1 text-3xl font-black text-stone-950">${formatCurrency(product.preco)}</p>
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
              <dd class="text-right text-stone-950">${escapeHtml(product.especificacoes.material)}</dd>
            </div>
            <div class="flex items-center justify-between gap-4">
              <dt class="font-bold text-stone-500">Captadores</dt>
              <dd class="text-right text-stone-950">${escapeHtml(product.especificacoes.captadores)}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  `;

  app.querySelector("[data-add-to-cart]").addEventListener("click", (event) => {
    window.CartStorage.addItem(product, 1);
    updateCartCount();
    event.currentTarget.innerHTML = `
      <i data-lucide="check" class="h-5 w-5"></i>
      Adicionado
    `;
    renderIcons();
  });
}
