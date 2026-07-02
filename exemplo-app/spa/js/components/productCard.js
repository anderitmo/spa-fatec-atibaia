import { escapeHtml, formatCurrency } from "../utils.js";

export function renderProductCard(product) {
  return `
    <article class="flex flex-col overflow-hidden rounded border border-stone-200 bg-white shadow-sm">
      <a href="#/produto/${product.id}" class="block bg-stone-100">
        <img src="${product.imagem}" alt="${escapeHtml(product.nome)}" class="aspect-[4/3] w-full object-cover">
      </a>
      <div class="flex flex-1 flex-col p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-amber-700">${escapeHtml(product.marca)}</p>
            <h2 class="mt-1 text-lg font-bold text-stone-950">${escapeHtml(product.nome)}</h2>
          </div>
          <span class="rounded bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">${escapeHtml(product.categoria)}</span>
        </div>
        <p class="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">${escapeHtml(product.descricao)}</p>
        <div class="mt-auto flex items-center justify-between gap-3 pt-5">
          <strong class="text-lg text-stone-950">${formatCurrency(product.preco)}</strong>
          <a href="#/produto/${product.id}" class="inline-flex h-10 w-10 items-center justify-center rounded bg-stone-950 text-white transition hover:bg-amber-500 hover:text-stone-950" aria-label="Ver ${escapeHtml(product.nome)}">
            <i data-lucide="arrow-right" class="h-5 w-5"></i>
          </a>
        </div>
      </div>
    </article>
  `;
}
