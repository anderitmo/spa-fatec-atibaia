import { renderProductCard } from "../components/productCard.js";
import { getProducts } from "../services/api.js";

export async function renderHome(app) {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 6);

  app.innerHTML = `
    <main>
      <section class="bg-stone-950 text-white">
        <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_0.85fr] md:items-center">
          <div>
            <p class="text-sm font-bold uppercase tracking-wide text-amber-300">E-commerce didatico</p>
            <h1 class="mt-3 text-4xl font-black leading-tight md:text-6xl">Guitar Shop SPA</h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-stone-300">A mesma loja de guitarras da MPA, agora com shell unico e atualizacao de tela via JavaScript.</p>
            <div class="mt-7 flex flex-wrap gap-3">
              <a href="#/categorias" class="inline-flex items-center gap-2 rounded bg-amber-500 px-5 py-3 text-sm font-black text-stone-950 transition hover:bg-amber-400">
                Ver catalogo
                <i data-lucide="arrow-right" class="h-5 w-5"></i>
              </a>
              <a href="#/cadastro" class="inline-flex items-center gap-2 rounded border border-stone-600 px-5 py-3 text-sm font-bold text-white transition hover:border-amber-300">
                Cadastro
                <i data-lucide="user-plus" class="h-5 w-5"></i>
              </a>
            </div>
          </div>
          <img src="https://placehold.co/720x540/292524/f59e0b?text=Guitar+Shop+SPA" alt="Guitarra em destaque da Guitar Shop SPA" class="aspect-[4/3] w-full rounded border border-stone-800 object-cover">
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-4 py-12">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-sm font-bold uppercase tracking-wide text-amber-700">Destaques</p>
            <h2 class="mt-2 text-3xl font-black text-stone-950">Produtos em destaque</h2>
          </div>
          <a href="#/categorias" class="inline-flex items-center gap-2 rounded border border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:text-stone-950">
            Todos os produtos
            <i data-lucide="grid-3x3" class="h-4 w-4"></i>
          </a>
        </div>

        <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          ${featuredProducts.map(renderProductCard).join("")}
        </div>
      </section>
    </main>
  `;
}
