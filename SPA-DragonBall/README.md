# Z-Scouter — SPA com JavaScript puro

Exemplo didático de **Single Page Application (SPA)** construída **sem frameworks**, consumindo a [Dragon Ball API](https://dragonball-api.com/). Material de apoio para uma aula sobre SPAs.

A aplicação demonstra, na prática, as três peças essenciais de uma SPA:

1. **Roteador no cliente** — decide qual tela mostrar conforme a URL, **sem recarregar a página** (History API / `pushState`).
2. **Busca de dados** — `fetch` numa API REST pública.
3. **Renderização dinâmica** — o HTML de cada tela é gerado a partir dos dados.

---

## Arquivos

```
index.html   # a "casca" única da aplicação
app.js        # roteador + fetch + renderização (todo comentado)
styles.css    # aparência (tema "scouter")
404.html      # cópia de index.html — fallback para o GitHub Pages
README.md
```

---

## Como rodar localmente

A aplicação **precisa ser servida por HTTP** — não funciona abrindo o `index.html`
com duplo-clique (`file://`), porque o navegador bloqueia o `fetch` nesse modo.

Com Python (já vem instalado na maioria dos sistemas):

```bash
python -m http.server 8000
```

Depois abra **http://localhost:8000**.

Alternativa: a extensão **Live Server** do VS Code (botão "Go Live").

---

## Rotas

| URL                  | Tela                         |
|----------------------|------------------------------|
| `/`                  | Início                       |
| `/personagens`       | Lista paginada de cards      |
| `/personagens?page=N`| Página N da lista            |
| `/personagem/:id`    | Ficha de detalhe             |
| *(qualquer outra)*   | 404                          |

---

## Hospedando no GitHub Pages

### Caso 1 — site de usuário (`seu-usuario.github.io`)
Funciona direto. Deixe `BASE_PATH = ""` no topo do `app.js`.

### Caso 2 — site de projeto (`seu-usuario.github.io/nome-do-repo`)
O app passa a viver sob um subcaminho. Faça **dois** ajustes:

1. No `app.js`, troque a constante:
   ```js
   const BASE_PATH = "/nome-do-repo";
   ```
2. No `index.html` **e** no `404.html`, ajuste o caminho dos assets para
   absoluto com o prefixo, por exemplo:
   ```html
   <link rel="stylesheet" href="/nome-do-repo/styles.css" />
   <script src="/nome-do-repo/app.js"></script>
   ```

### Por que existe o `404.html`?
Com `pushState`, navegar *dentro* do app funciona. Mas se o usuário **recarregar**
(F5) numa rota profunda como `/personagem/5`, o GitHub Pages procura um arquivo
nesse caminho, não encontra e serve o `404.html`. Como o `404.html` é uma **cópia
do `index.html`**, a aplicação carrega mesmo assim, lê a URL e desenha a tela certa.
É o "fallback para index.html" — adaptado ao que o GitHub Pages permite.

> **Alternativa sem essa complicação:** roteamento por *hash* (`/#/personagem/5`).
> O navegador nunca envia o que vem depois do `#` ao servidor, então recarregar
> "simplesmente funciona", sem `404.html` nem `BASE_PATH`. Este projeto usa
> `pushState` de propósito, por ser o foco didático e gerar URLs mais limpas.

---

## Avisos honestos

- **CORS:** a SPA busca dados de outro domínio (a API). Isso depende de a API
  permitir requisições via cabeçalhos CORS. Em testes de navegador essa API
  costuma funcionar, mas se você vir um erro de CORS no console, a saída é usar
  um proxy ou um arquivo JSON local.
- **Endpoint de detalhe:** os campos básicos (nome, imagem, raça, ki...) são
  garantidos; já `transformations` e `originPlanet` aparecem só para alguns
  personagens. O código os exibe **apenas quando existem** — então fichas sem
  esses dados continuam funcionando.

---

## Créditos

Dados fornecidos pela **Dragon Ball API** (`https://dragonball-api.com`), um
projeto de terceiros. *Dragon Ball* e seus personagens pertencem aos respectivos
detentores de direitos. Este repositório é **apenas educacional** e não
redistribui o conteúdo da API.

Licença sugerida para o código: **MIT** (ajuste conforme preferir).
