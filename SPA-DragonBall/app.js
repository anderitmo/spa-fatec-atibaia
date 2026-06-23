/* ============================================================================
 * app.js — O "cérebro" da SPA
 * ============================================================================
 *
 * Aqui mora TODA a lógica que, num app com framework (React/Vue/Angular),
 * estaria escondida atrás de bibliotecas. Fazendo na mão, você enxerga as
 * três peças essenciais de uma SPA:
 *
 *   1) ROTEADOR    -> decide qual tela mostrar conforme a URL (sem recarregar)
 *   2) DADOS       -> busca informação na API com fetch()
 *   3) RENDERIZA   -> transforma os dados em HTML dentro de <div id="app">
 *
 * Leia de cima para baixo: o código está ordenado na ordem em que faz sentido
 * aprender.
 * ========================================================================== */


/* ----------------------------------------------------------------------------
 * 0) CONFIGURAÇÃO
 * -------------------------------------------------------------------------- */

// Endereço base da API que vamos consumir.
// (Confirmado: a lista vem em /characters e cada item tem id, name, image, etc.)
const API_BASE = "https://dragonball-api.com/api";

// Quantos personagens por página na listagem.
const PAGE_SIZE = 12;

// BASE_PATH: prefixo do caminho onde o site está hospedado.
//   - Local (python -m http.server) ............ deixe ""  (raiz)
//   - GitHub Pages de usuário (user.github.io) .. deixe ""  (raiz)
//   - GitHub Pages de PROJETO (user.github.io/meu-repo) -> use "/meu-repo"
// Veja a seção "GitHub Pages" no README para entender o porquê.
const BASE_PATH = "";


/* ----------------------------------------------------------------------------
 * 1) ATALHOS / UTILIDADES
 * -------------------------------------------------------------------------- */

// Referência ao container onde tudo é desenhado.
const app = document.getElementById("app");

// Monta um caminho já com o BASE_PATH na frente.
// Ex.: to("/personagens") -> "/personagens" (ou "/meu-repo/personagens")
function to(path) {
  return BASE_PATH + path;
}

// Devolve o caminho atual SEM o BASE_PATH, para o roteador comparar.
// Ex.: se a URL é "/meu-repo/personagem/5", retorna "/personagem/5".
function currentPath() {
  let path = location.pathname;
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length);
  }
  return path || "/";
}

// Escapa texto antes de injetar no HTML, evitando que conteúdo da API
// "quebre" a página (boa prática de segurança ao usar innerHTML).
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}


/* ----------------------------------------------------------------------------
 * 2) ESTADOS DE TELA REUTILIZÁVEIS (carregando / erro)
 * -------------------------------------------------------------------------- */

// Mostra um "carregando..." enquanto o fetch não volta.
function renderLoading(mensagem = "Carregando...") {
  app.innerHTML = `
    <section class="state">
      <div class="spinner" aria-hidden="true"></div>
      <p>${escapeHtml(mensagem)}</p>
    </section>
  `;
}

// Mostra uma mensagem de erro clara e acionável (não um "algo deu errado" vago).
function renderError(mensagem) {
  app.innerHTML = `
    <section class="state state--error">
      <h2>Não foi possível carregar</h2>
      <p>${escapeHtml(mensagem)}</p>
      <a class="btn" href="${to("/personagens")}" data-link>Tentar a lista novamente</a>
    </section>
  `;
}


/* ----------------------------------------------------------------------------
 * 3) AS TELAS (cada função desenha uma "página" dentro do #app)
 * -------------------------------------------------------------------------- */

// --- TELA: Início -----------------------------------------------------------
function telaInicio() {
  app.innerHTML = `
    <section class="hero">
      <p class="hero__eyebrow">Single Page Application · JavaScript puro</p>
      <h1 class="hero__title">Leitor de poder<br>de combate</h1>
      <p class="hero__lead">
        Uma única página HTML. O JavaScript troca o conteúdo e busca dados na API
        <strong>sem recarregar</strong> — navegação fluida via History API.
      </p>
      <a class="btn btn--primary" href="${to("/personagens")}" data-link>
        Abrir catálogo →
      </a>
    </section>
  `;
}

// --- TELA: Lista de personagens (paginada) ----------------------------------
// É uma função async porque precisa ESPERAR o fetch terminar.
async function telaPersonagens() {
  // Lê o número da página da query string (?page=2). Padrão: 1.
  const page = Number(new URLSearchParams(location.search).get("page")) || 1;

  renderLoading("Buscando guerreiros...");

  try {
    // Monta a URL com paginação e faz a requisição.
    const url = `${API_BASE}/characters?page=${page}&limit=${PAGE_SIZE}`;
    const resposta = await fetch(url);

    // fetch() NÃO lança erro para status 404/500 — precisamos checar na mão.
    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}.`);
    }

    const dados = await resposta.json();

    // ATENÇÃO: nesta API a lista vem em "items" (não na raiz),
    // e a info de paginação vem em "meta". (Confirmado na resposta real.)
    const personagens = dados.items || [];
    const meta = dados.meta || {};

    if (personagens.length === 0) {
      app.innerHTML = `<section class="state"><p>Nenhum personagem nesta página.</p></section>`;
      return;
    }

    // Monta um card para cada personagem.
    // Repare que o link de cada card aponta para /personagem/ID — é assim que
    // passamos um PARÂMETRO pela URL.
    const cards = personagens
      .map(
        (p) => `
        <a class="card" href="${to("/personagem/" + p.id)}" data-link>
          <div class="card__media">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
          </div>
          <div class="card__body">
            <h3 class="card__name">${escapeHtml(p.name)}</h3>
            <span class="card__race">${escapeHtml(p.race || "?")}</span>
            <span class="card__ki">KI ${escapeHtml(p.ki || "—")}</span>
          </div>
        </a>`
      )
      .join("");

    // Controles de paginação (anterior / próxima), usando os totais de "meta".
    const totalPages = meta.totalPages || 1;
    const atual = meta.currentPage || page;

    const anteriorDisabled = atual <= 1 ? "is-disabled" : "";
    const proximaDisabled = atual >= totalPages ? "is-disabled" : "";

    app.innerHTML = `
      <section class="list">
        <header class="list__head">
          <h2>Catálogo</h2>
          <p>${escapeHtml(meta.totalItems || personagens.length)} guerreiros no total</p>
        </header>

        <div class="grid">${cards}</div>

        <nav class="pager">
          <a class="btn ${anteriorDisabled}" href="${to("/personagens")}?page=${atual - 1}" data-link>← Anterior</a>
          <span class="pager__info">Página ${escapeHtml(atual)} de ${escapeHtml(totalPages)}</span>
          <a class="btn ${proximaDisabled}" href="${to("/personagens")}?page=${atual + 1}" data-link>Próxima →</a>
        </nav>
      </section>
    `;
  } catch (erro) {
    // Erro de rede, CORS ou status ruim caem aqui.
    renderError(erro.message + " Verifique sua conexão (e o CORS da API).");
  }
}

// --- TELA: Detalhe de um personagem -----------------------------------------
// Recebe o "id" que o roteador extraiu da URL (/personagem/:id).
async function telaPersonagem(id) {
  renderLoading("Lendo nível de poder...");

  try {
    // Endpoint de detalhe: /characters/{id}.
    const resposta = await fetch(`${API_BASE}/characters/${id}`);

    if (!resposta.ok) {
      throw new Error(`Personagem não encontrado (status ${resposta.status}).`);
    }

    const p = await resposta.json();

    /*
     * RENDERIZAÇÃO DEFENSIVA
     * ----------------------
     * Os campos básicos (name, image, race...) são garantidos pela API.
     * Mas "transformations" e "originPlanet" só existem para ALGUNS
     * personagens e podem variar de formato. Por isso, só montamos esses
     * blocos SE eles existirem — nunca assumimos que estão lá.
     */

    // Bloco de transformações (se houver lista).
    let transformacoesHtml = "";
    if (Array.isArray(p.transformations) && p.transformations.length > 0) {
      const itens = p.transformations
        .map(
          (t) => `
          <li class="trans">
            ${t.image ? `<img src="${escapeHtml(t.image)}" alt="${escapeHtml(t.name || "")}" loading="lazy" />` : ""}
            <div>
              <strong>${escapeHtml(t.name || "Transformação")}</strong>
              ${t.ki ? `<span class="trans__ki">KI ${escapeHtml(t.ki)}</span>` : ""}
            </div>
          </li>`
        )
        .join("");
      transformacoesHtml = `
        <section class="detail__block">
          <h3>Transformações</h3>
          <ul class="trans-list">${itens}</ul>
        </section>`;
    }

    // Bloco de planeta de origem (se existir e tiver nome).
    let planetaHtml = "";
    if (p.originPlanet && p.originPlanet.name) {
      planetaHtml = `
        <section class="detail__block">
          <h3>Planeta de origem</h3>
          <p>${escapeHtml(p.originPlanet.name)}</p>
        </section>`;
    }

    app.innerHTML = `
      <article class="detail">
        <a class="back" href="${to("/personagens")}" data-link>← Voltar ao catálogo</a>

        <div class="detail__top">
          <div class="detail__media">
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" />
          </div>

          <div class="detail__info">
            <h1>${escapeHtml(p.name)}</h1>
            <ul class="stats">
              <li><span>Raça</span><strong>${escapeHtml(p.race || "—")}</strong></li>
              <li><span>Gênero</span><strong>${escapeHtml(p.gender || "—")}</strong></li>
              <li><span>KI</span><strong>${escapeHtml(p.ki || "—")}</strong></li>
              <li><span>KI máximo</span><strong>${escapeHtml(p.maxKi || "—")}</strong></li>
              <li><span>Afiliação</span><strong>${escapeHtml(p.affiliation || "—")}</strong></li>
            </ul>
          </div>
        </div>

        ${p.description ? `<section class="detail__block"><h3>Descrição</h3><p>${escapeHtml(p.description)}</p></section>` : ""}
        ${planetaHtml}
        ${transformacoesHtml}
      </article>
    `;
  } catch (erro) {
    renderError(erro.message);
  }
}

// --- TELA: 404 --------------------------------------------------------------
function tela404() {
  app.innerHTML = `
    <section class="state">
      <h2>404</h2>
      <p>Esta rota não existe.</p>
      <a class="btn" href="${to("/")}" data-link>Voltar ao início</a>
    </section>
  `;
}


/* ----------------------------------------------------------------------------
 * 4) O ROTEADOR
 * -------------------------------------------------------------------------- */

/*
 * router(): olha a URL atual e chama a tela correspondente.
 * Esta função é o coração da SPA. Ela roda:
 *   - ao carregar a página (primeira vez),
 *   - sempre que clicamos num link interno,
 *   - quando o usuário usa Voltar/Avançar do navegador.
 */
function router() {
  const path = currentPath();

  // Rota de detalhe tem um PARÂMETRO. Usamos uma expressão regular para
  // capturar o id em /personagem/123.
  const matchDetalhe = path.match(/^\/personagem\/(\w+)$/);

  if (path === "/") {
    telaInicio();
  } else if (path === "/personagens") {
    telaPersonagens();
  } else if (matchDetalhe) {
    // matchDetalhe[1] é o "123" capturado pela regex.
    telaPersonagem(matchDetalhe[1]);
  } else {
    tela404();
  }

  // Rola para o topo a cada troca de tela (comportamento esperado de navegação).
  window.scrollTo(0, 0);
}


/* ----------------------------------------------------------------------------
 * 5) LIGANDO TUDO: interceptar cliques e os botões Voltar/Avançar
 * -------------------------------------------------------------------------- */

/*
 * (A) Interceptar cliques nos links marcados com data-link.
 *
 * Sem isto, clicar num <a> faria o navegador RECARREGAR a página inteira
 * (o comportamento do velho modelo MPA). Nós impedimos isso e, no lugar,
 * trocamos a URL com history.pushState e redesenhamos só o #app.
 */
document.addEventListener("click", (evento) => {
  // Acha o <a data-link> mais próximo de onde o usuário clicou
  // (funciona mesmo clicando numa imagem dentro do link).
  const link = evento.target.closest("a[data-link]");
  if (!link) return; // clicou em outra coisa: deixa o navegador agir normalmente

  // Respeita atalhos do usuário (Ctrl/Cmd+clique = abrir em nova aba).
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey) return;

  evento.preventDefault(); // CANCELA o recarregamento padrão

  const destino = link.getAttribute("href");

  // Se já estamos na mesma URL, não faz nada.
  if (destino === location.pathname + location.search) return;

  // pushState: muda a URL na barra de endereços e adiciona ao histórico,
  // SEM recarregar a página. (Esta é a peça-chave da History API.)
  history.pushState(null, "", destino);

  // Agora que a URL mudou, desenhamos a tela correspondente.
  router();
});

/*
 * (B) Fazer os botões Voltar/Avançar funcionarem.
 *
 * Quando o usuário clica em Voltar, o navegador muda a URL sozinho e dispara
 * o evento "popstate". Sem este listener, a tela NÃO se atualizaria.
 */
window.addEventListener("popstate", router);

/*
 * (C) Primeira renderização: desenha a tela certa para a URL inicial.
 */
router();
