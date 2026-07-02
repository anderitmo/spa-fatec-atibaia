import { renderHeader } from "./components/header.js";
import { renderIcons } from "./utils.js";
import { renderHome } from "./views/home.js";
import { renderCategorias } from "./views/categorias.js";
import { renderProduto } from "./views/produto.js";
import { renderCarrinho } from "./views/carrinho.js";
import { renderCadastro } from "./views/cadastro.js";

function parseHash() {
  const hash = window.location.hash.slice(1) || "/";
  const [path, queryString = ""] = hash.split("?");

  return {
    path: path || "/",
    params: new URLSearchParams(queryString)
  };
}

function getProductId(path) {
  const match = path.match(/^\/produto\/([^/]+)$/);
  return match ? match[1] : "";
}

async function renderRoute() {
  const app = document.querySelector("#app");
  const route = parseHash();

  app.innerHTML = `<p class="mx-auto max-w-6xl px-4 py-10 text-stone-600">Carregando...</p>`;
  renderHeader();

  try {
    if (route.path === "/") {
      await renderHome(app);
    } else if (route.path === "/categorias") {
      await renderCategorias(app, route.params);
    } else if (route.path.startsWith("/produto/")) {
      await renderProduto(app, getProductId(route.path));
    } else if (route.path === "/carrinho") {
      renderCarrinho(app);
    } else if (route.path === "/cadastro") {
      renderCadastro(app);
    } else {
      app.innerHTML = `
        <main class="mx-auto max-w-6xl px-4 py-12">
          <div class="rounded border border-stone-200 bg-white p-8">
            <h1 class="text-3xl font-black text-stone-950">Rota nao encontrada</h1>
            <p class="mt-3 text-stone-600">A pagina solicitada nao existe nesta SPA.</p>
            <a href="#/" class="mt-6 inline-flex items-center gap-2 rounded bg-stone-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-stone-950">
              Voltar para home
              <i data-lucide="arrow-right" class="h-4 w-4"></i>
            </a>
          </div>
        </main>
      `;
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <main class="mx-auto max-w-6xl px-4 py-12">
        <p class="rounded border border-red-200 bg-red-50 p-6 text-red-800">Nao foi possivel carregar esta tela. Rode a aplicacao em um servidor local.</p>
      </main>
    `;
  }

  renderIcons();
}

export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  renderRoute();
}
