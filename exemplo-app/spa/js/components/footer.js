const categories = [
  { label: "Eletricas", href: "#/categorias?categoria=eletrica" },
  { label: "Acusticas", href: "#/categorias?categoria=acustica" },
  { label: "Baixos", href: "#/categorias?categoria=baixo" },
  { label: "Classicas", href: "#/categorias?categoria=classica" }
];

export function renderFooter() {
  const footer = document.querySelector("[data-spa-footer]");

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
