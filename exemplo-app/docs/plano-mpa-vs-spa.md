# Plano de Orquestração — Aplicação Didática MPA vs SPA

**Projeto:** E-commerce de guitarras, em duas versões (Multi Page e Single Page) com mesmo conteúdo e identidade visual.
**Stack:** HTML, CSS (Tailwind via CDN), JavaScript puro (vanilla), Lucide Icons (CDN), `fetch` + JSON.
**Status das decisões:** confirmadas em conversa anterior (ver seção "Decisões confirmadas").

---

## 1. Visão Geral

### 1.1 Objetivo pedagógico
Demonstrar, na prática, as diferenças estruturais e de comportamento entre uma aplicação Multi Page (MPA) e uma Single Page Application (SPA), usando o **mesmo conteúdo** (e-commerce de guitarras) e a **mesma identidade visual**, para isolar a variável "arquitetura de navegação" de qualquer diferença de design.

### 1.2 Decisões confirmadas
| Decisão | Escolha |
|---|---|
| Persistência do carrinho | `localStorage`, mesma lógica/chave nos dois apps |
| Roteamento da SPA | **Hash routing** (`#/produto/3`) — sem necessidade de servidor customizado |
| Form de cadastro | Cadastro de cliente/usuário (nome, e-mail, senha, endereço) — simulado, sem backend |
| Tooling de servidor | Nenhum script customizado necessário; qualquer servidor estático padrão serve (ex: `python -m http.server`, Live Server do VSCode, `npx serve`) |

### 1.3 Limitações conhecidas e registradas
- **Tailwind via CDN (Play CDN):** adequado para fins didáticos; o próprio Tailwind recomenda não usar em produção (sem purge de CSS).
- **`fetch()` de JSON local exige servidor:** não funciona abrindo os arquivos via `file://` no navegador (restrição de CORS). É necessário rodar qualquer servidor estático local.
- **Sem backend real:** cadastro e carrinho são simulados via `localStorage`; não há persistência entre dispositivos ou sessões diferentes.
- **Imagens dos produtos:** serão placeholders (`placehold.co`), não fotos reais — assumido por falta de assets fornecidos. *(Hipótese a confirmar com o usuário se desejar trocar a fonte das imagens.)*

### 1.4 Estrutura de pastas

```
guitarras-app/
├── shared/
│   └── data/guitarras.json    # fonte única de dados (fetch em ambos os apps)
├── mpa/
│   ├── index.html
│   ├── categorias.html
│   ├── produto.html           # ?id=1
│   ├── carrinho.html
│   ├── cadastro.html
│   └── js/
│       ├── cart-storage.js    # helper localStorage
│       ├── render-shared.js   # header/footer/contador do carrinho
│       ├── home.js
│       ├── categorias.js
│       ├── produto.js
│       ├── carrinho.js
│       └── cadastro.js
└── spa/
    ├── index.html             # shell único, <div id="app">
    └── js/
        ├── app.js              # bootstrap + listeners globais
        ├── router.js           # mapa de rotas via hash + hashchange
        ├── cart-storage.js     # mesmo conteúdo do mpa/js/cart-storage.js
        ├── services/api.js     # fetch + cache em memória do JSON
        ├── components/
        │   ├── header.js
        │   ├── footer.js
        │   └── productCard.js
        └── views/
            ├── home.js
            ├── categorias.js
            ├── produto.js
            ├── carrinho.js
            └── cadastro.js
```

`cart-storage.js` é copiado igual nos dois projetos (sem bundler para compartilhar módulos entre pastas) — intencional: mostra que a lógica de negócio pode ser idêntica, só muda a forma de orquestrar a renderização.

### 1.5 Schema de `guitarras.json` (8 itens)
```json
{
  "id": 1,
  "nome": "string",
  "marca": "string",
  "categoria": "eletrica | acustica | baixo | classica",
  "preco": 0.0,
  "imagem": "https://placehold.co/...",
  "descricao": "string",
  "especificacoes": { "cordas": 6, "material": "string", "captadores": "string" },
  "estoque": 0
}
```

### 1.6 Identidade visual compartilhada
- Tailwind via CDN nos dois apps, com o **mesmo bloco de `tailwind.config`** (paleta de cores, fonte, espaçamentos) copiado igual em ambos.
- Ícones via Lucide CDN (`lucide.createIcons()` chamado após cada render).
- Layout minimalista: header fixo simples, grid de produtos, sem animações ou elementos decorativos supérfluos.

### 1.7 Pontos de comparação a evidenciar
| Aspecto | MPA | SPA |
|---|---|---|
| Navegação | reload completo (flash branco, reparse de JS/CSS) | atualização de DOM via JS |
| Requisições de rede por navegação | 1 doc HTML + reload de assets + 1 fetch JSON | apenas dados (JSON cacheado após 1ª carga) |
| Estrutura de código | header/footer duplicados em cada `.html` | componentes reutilizáveis (`header.js`, `footer.js`) |
| URL/roteamento | arquivos físicos (`produto.html?id=3`) | rota virtual via fragmento (`#/produto/3`) |
| Carrinho | localStorage (mesmo dado, recarregado a cada página) | localStorage (mesmo dado, refletido sem reload) |

Sugestão opcional: incluir um contador visível de "page loads completos" em cada app, para tornar a diferença observável em sala sem precisar abrir o DevTools.

---

## 2. Tarefas

### Fase 1 — Dados e tooling
- [x] Criar `shared/data/guitarras.json` com 8 guitarras (variando categoria, marca, preço)
- [x] Validar manualmente que o JSON é bem formado

### Fase 2 — Lógica compartilhada
- [x] Criar `cart-storage.js` (funções: `getCart`, `addItem`, `removeItem`, `updateQty`, `clearCart`, `getTotal`)
- [x] Copiar `cart-storage.js` para `mpa/js/` e `spa/js/`

### Fase 3 — Versão MPA
- [x] `index.html` (home) + `home.js` — lista de produtos em destaque
- [x] `categorias.html` + `categorias.js` — filtro por categoria (via query string `?categoria=`)
- [x] `produto.html` + `produto.js` — detalhe via `?id=`
- [x] `carrinho.html` + `carrinho.js` — listagem, quantidade, total, remoção
- [x] `cadastro.html` + `cadastro.js` — formulário de cliente com validação básica
- [x] `render-shared.js` — header/footer + contador de itens do carrinho, reaproveitado via `<script>` em cada página
- [x] Configuração idêntica do Tailwind e do Lucide em todas as páginas

### Fase 4 — Versão SPA
- [x] `index.html` (shell único)
- [x] `router.js` — mapeamento de rotas via hash + `hashchange` + render inicial no `DOMContentLoaded`
- [x] `services/api.js` — fetch único do JSON, cache em memória
- [x] `components/header.js`, `footer.js`, `productCard.js`
- [x] `views/home.js`, `categorias.js` (com filtro via `?categoria=` dentro do hash), `produto.js`, `carrinho.js`, `cadastro.js`
- [x] `app.js` — bootstrap, montagem dos componentes fixos (header/footer) e inicialização do router

### Fase 5 — Comparação e revisão
- [x] Página raiz simples com dois links ("Versão MPA" / "Versão SPA") para facilitar a demonstração
- [x] (Opcional) Contador de "page loads completos" visível em cada app
- [x] Checklist de paridade visual entre MPA e SPA (mesmas telas, mesmo conteúdo, mesmo Tailwind config)
- [x] Pontos a verificar manualmente no navegador (não testados por mim até a execução real):
  - [x] Comportamento do `fetch` rodando em servidor local — JSON validado via HTTP em `http://127.0.0.1:8001/shared/data/guitarras.json`
  - [ ] Filtro de categoria combinado com hash routing na SPA — exige navegacao real no browser
  - [ ] Persistência do carrinho via `localStorage` nos dois apps após reload — exige navegacao real no browser

### Checklist de paridade visual MPA vs SPA
- [x] Home presente nas duas versões, com hero, CTA e produtos em destaque
- [x] Categorias presentes nas duas versões, com filtros equivalentes
- [x] Detalhe de produto presente nas duas versões, com preço, estoque, especificações e ação de carrinho
- [x] Carrinho presente nas duas versões, com edição de quantidade, remoção, limpeza e total
- [x] Cadastro presente nas duas versões, com validação básica e persistência simulada
- [x] Header/footer equivalentes nas duas versões
- [x] Mesmo catálogo `shared/data/guitarras.json`
- [x] Mesmo `cart-storage.js` em `mpa/js/` e `spa/js/`
- [x] Mesmo bloco de configuração Tailwind e Lucide em MPA, SPA e página raiz

---

## 3. Observações finais

- Este plano reflete decisões já confirmadas; qualquer alteração de escopo deve atualizar tanto a Visão Geral quanto as Tarefas correspondentes.
- Itens marcados como "Hipótese" ou "Opcional" exigem confirmação antes da implementação definitiva.
- Fases 1 a 5 executadas neste workspace; este documento agora reflete o status atual da implementação.
