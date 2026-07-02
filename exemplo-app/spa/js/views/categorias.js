import { renderProductCard } from "../components/productCard.js";
import { getProducts } from "../services/api.js";

const categories = [
  { value: "todas", label: "Todas" },
  { value: "eletrica", label: "Eletricas" },
  { value: "acustica", label: "Acusticas" },
  { value: "baixo", label: "Baixos" },
  { value: "classica", label: "Classicas" }
];

function getCategoryHref(category) {
  return category === "todas" ? "#/categorias" : `#/categorias?categoria=${category}`;
}

function renderTabs(selectedCategory) {
  return categories.map((category) => {
    const isActive = category.value === selectedCategory;
    const className = [
      "rounded px-4 py-2 text-sm font-bold transition",
      isActive ? "bg-stone-950 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-amber-500 hover:text-stone-950"
    ].join(" ");

    return `<a href="${getCategoryHref(category.value)}" class="${className}">${category.label}</a>`;
  }).join("");
}

export async function renderCategorias(app, params) {
  const selectedCategory = params.get("categoria") || "todas";
  const products = await getProducts();
  const visibleProducts = selectedCategory === "todas"
    ? products
    : products.filter((product) => product.categoria === selectedCategory);
  const currentCategory = categories.find((category) => category.value === selectedCategory);

  app.innerHTML = `
    <main class="mx-auto max-w-6xl px-4 py-10">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-amber-700">Catalogo</p>
          <h1 class="mt-2 text-4xl font-black text-stone-950">Categoria: ${currentCategory ? currentCategory.label : "Todas"}</h1>
        </div>
        <a href="#/carrinho" class="inline-flex items-center gap-2 rounded bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950">
          Carrinho
          <i data-lucide="shopping-cart" class="h-4 w-4"></i>
        </a>
      </div>

      <div class="mt-8 flex flex-wrap gap-2">${renderTabs(selectedCategory)}</div>

      <div class="mt-8 grid gap-5">
        ${
          visibleProducts.length
            ? visibleProducts.map(renderProductCard).join("")
            : `<p class="rounded border border-stone-200 bg-white p-6 text-stone-600">Nenhum produto encontrado nesta categoria.</p>`
        }
      </div>
    </main>
  `;
}
