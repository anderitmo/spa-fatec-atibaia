# Projeto: SPA com JavaScript Puro — Catálogo de Personagens

> Exemplo didático de **Single Page Application (SPA)** construída **sem frameworks**, consumindo uma API REST pública. Material de apoio para uma aula de 40 minutos sobre SPAs.

---

## Sumário

- [Objetivo](#objetivo)
- [Conceitos demonstrados](#conceitos-demonstrados)
- [A API consumida](#a-api-consumida)
- [Arquitetura e arquivos](#arquitetura-e-arquivos)
- [Rotas](#rotas)
- [Fluxo de funcionamento](#fluxo-de-funcionamento)
- [Como rodar](#como-rodar)
- [Cuidados técnicos conhecidos](#cuidados-técnicos-conhecidos)
- [Roadmap de implementação](#roadmap-de-implementação)
- [Status de verificação](#status-de-verificação)
- [Licença e créditos](#licença-e-créditos)

---

## Objetivo

Construir, do zero e com **JavaScript puro** (sem React/Vue/Angular), uma SPA que:

1. Lista personagens vindos de uma API REST pública.
2. Permite abrir a **ficha de detalhe** de cada personagem.
3. Navega entre as telas **sem recarregar a página**, usando a **History API (`pushState`)**.

O foco pedagógico é mostrar, na prática, **como uma SPA funciona por baixo dos panos** — antes de introduzir frameworks que automatizam tudo isso.

---

## Conceitos demonstrados

| Conceito | Onde aparece no projeto |
|----------|-------------------------|
| **Manipulação do DOM** | A tela é montada via JS dentro de um único `<div id="app">`. |
| **Roteamento no cliente** | Um roteador próprio decide qual tela exibir conforme a URL. |
| **`hashchange`** *(menção)* | Citado como alternativa histórica; **não** é o foco. |
| **History API (`pushState` / `popstate`)** | Abordagem principal de navegação. |
| **Rota com parâmetro** | `/personagem/:id` extrai o `id` da URL. |
| **`fetch` + API REST** | Busca assíncrona de dados em JSON. |
| **Renderização dinâmica** | O HTML é gerado a partir dos dados recebidos. |
| **Estado** | Controle da página atual na listagem paginada. |

---

## A API consumida

**Dragon Ball API** — `https://dragonball-api.com/api`

> Esta é uma API pública de terceiros. O projeto apenas **consome** seus dados em tempo de execução; nenhum conteúdo é redistribuído neste repositório.

### Endpoint de listagem (confirmado)

```
GET https://dragonball-api.com/api/characters?page=1&limit=10
```

Resposta (estrutura real, com a descrição encurtada aqui por brevidade):

```json
{
  "items": [
    {
      "id": 1,
      "name": "Goku",
      "ki": "60.000.000",
      "maxKi": "90 Septillion",
      "race": "Saiyan",
      "gender": "Male",
      "affiliation": "Z Fighter",
      "image": "https://dragonball-api.com/characters/goku_normal.webp",
      "description": "..."
    }
  ],
  "meta": {
    "totalItems": 58,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 6,
    "currentPage": 1
  },
  "links": {
    "first": "...",
    "previous": "...",
    "next": "...",
    "last": "..."
  }
}
```

Pontos importantes:

- O array de personagens vem em **`items`** (não na raiz).
- A **paginação** é controlada por `?page=N&limit=M`; os totais ficam em `meta`.
- Cada `image` já é uma **URL pronta** para usar em `<img>`.

### Endpoint de detalhe (a confirmar)

```
GET https://dragonball-api.com/api/characters/{id}
```

> **Inferência, ainda não verificada:** segue o padrão REST e provavelmente devolve um objeto único, possivelmente com campos extras (ex.: `transformations`, `originPlanet`) além dos da listagem. A estrutura exata será confirmada durante a implementação — nenhum campo será assumido sem checagem.

---

## Arquitetura e arquivos

```
/
├── index.html      # casca única da aplicação (nav + <div id="app">)
├── app.js          # roteador, render e chamadas à API
├── styles.css      # estilos mínimos (opcional)
└── README.md
```

Não há arquivo de dados local: **a API substitui o banco de dados**.

---

## Rotas

| URL | Tela | Origem dos dados |
|-----|------|------------------|
| `/` | Início / boas-vindas | estática |
| `/personagens` | Lista paginada de cards | `GET /api/characters?page=N` |
| `/personagem/:id` | Ficha de detalhe | `GET /api/characters/:id` |
| *(qualquer outra)* | Tela 404 | — |

---

## Fluxo de funcionamento

1. O navegador carrega **uma única vez** o `index.html` + `app.js`.
2. O `app.js` lê a URL atual, identifica a rota e chama a função de renderização correspondente.
3. Se a rota precisa de dados, a função faz `fetch` na API, recebe JSON e monta o HTML dentro do `#app`.
4. Ao clicar em um link interno, o roteador:
   - intercepta o clique (`event.preventDefault()`),
   - chama `history.pushState(...)` para mudar a URL **sem recarregar**,
   - re-renderiza a tela.
5. O evento `popstate` garante que os botões **Voltar/Avançar** refaçam a navegação corretamente.

---

## Como rodar

> A aplicação **precisa ser servida por um servidor HTTP** — não funciona abrindo o arquivo com duplo-clique (`file://`).

Opção 1 — Python:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

Opção 2 — extensão **Live Server** do VS Code (botão "Go Live").

---

## Cuidados técnicos conhecidos

Estes pontos são onde exemplos de SPA costumam falhar. Estão documentados de propósito, pois rendem boas discussões em aula.

### 1. `fetch` não funciona via `file://`
Abrir o HTML direto do disco faz o navegador bloquear o `fetch` por segurança. **Solução:** servir por HTTP (ver seção anterior).

### 2. CORS
Para uma página buscar dados de **outro domínio** (a API), o servidor da API precisa enviar os cabeçalhos CORS adequados.

> **Inferência:** por ser uma API muito usada em tutoriais de navegador, o CORS provavelmente está liberado — mas isso **ainda não foi verificado** neste plano e deve ser o **primeiro teste** na implementação. Caso esteja bloqueado, alternativas são usar um proxy ou voltar a um JSON local.

### 3. `pushState` + recarregar uma rota profunda
Navegar até `/personagem/5` **dentro** do app funciona. Mas apertar **F5** nessa URL faz o servidor procurar um arquivo `/personagem/5` que não existe → erro 404.

- **Para a aula:** navegar sempre a partir do `/` pelos links (o `pushState` cobre tudo).
- **Solução completa:** configurar o servidor para devolver `index.html` em qualquer rota (*fallback*), o que exige um servidor mais configurável que o `http.server` do Python.

---

## Roadmap de implementação

- [ ] `index.html` com `<nav>` e `<div id="app">`.
- [ ] Função `render()` central + tabela de rotas.
- [ ] Roteador com `pushState` + listener de `popstate`.
- [ ] Tela `/personagens`: `fetch` da lista + cards + paginação.
- [ ] Tela `/personagem/:id`: **confirmar o endpoint de detalhe** e renderizar a ficha.
- [ ] Tela 404.
- [ ] Tratamento de erros de rede (estado de "carregando" e de "falha").
- [ ] `styles.css` mínimo.
- [ ] Testar no navegador via servidor local (incluindo CORS).

---

## Status de verificação

Seguindo o princípio de separar o que é **fato** do que é **suposição**:

- **Verificado (fato):** existência da API, base `https://dragonball-api.com/api`, endpoint de listagem, campos de cada personagem e o esquema de paginação — todos observados em resposta real da API.
- **A verificar (inferência):** estrutura exata do endpoint de detalhe; comportamento de CORS no navegador; comportamento de recarregar rotas profundas no servidor escolhido.
- **Não testado:** nenhum código foi executado ainda; este documento é apenas o plano.

**Confiança geral do plano: Média-Alta.** Os fundamentos estão confirmados; as incertezas restantes são pontuais e estão explicitamente marcadas para verificação na fase de implementação.

---

## Licença e créditos

- Código de exemplo: sugestão de licença **MIT** (ajuste conforme sua preferência).
- Dados de personagens: fornecidos pela **Dragon Ball API** (`https://dragonball-api.com`), projeto de terceiros. *Dragon Ball* e seus personagens são propriedade de seus respectivos detentores de direitos; este projeto é apenas educacional e não redistribui o conteúdo da API.
