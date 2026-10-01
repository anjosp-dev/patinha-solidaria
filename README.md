<div align="center">

# 🐾 Patinha Solidária

**Plataforma web da ONG Patinha Solidária: resgate, adoção responsável e captação de recursos para cães e gatos vítimas de maus-tratos e abandono.**

Single Page Application (SPA) em HTML5, CSS3 e JavaScript puro (ES6 Modules), acessível (WCAG 2.1 AA) e responsiva.

🔗 **Site no ar:** https://anjosp-dev.github.io/patinha-solidaria/ *(disponível após o deploy)*

</div>

---

## 📑 Sumário

1. [Sobre o projeto](#-sobre-o-projeto)
2. [Funcionalidades](#-funcionalidades)
3. [Tecnologias](#-tecnologias)
4. [Estrutura de pastas](#-estrutura-de-pastas)
5. [Como executar](#-como-executar)
6. [Testes](#-testes)
7. [Build de produção e deploy](#-build-de-produção-e-deploy)
8. [Como usar](#-como-usar)
9. [Arquitetura](#-arquitetura)
10. [Fluxo de versionamento (GitFlow)](#-fluxo-de-versionamento-gitflow)
11. [Padrão de commits](#-padrão-de-commits)
12. [Acessibilidade](#-acessibilidade)
13. [Manutenção](#-manutenção)
14. [Autor](#-autor)

---

## 💡 Sobre o projeto

Segundo o IBGE, o Brasil tem mais de 820 mil organizações da sociedade civil, mas apenas 30% possuem presença digital adequada. A **Patinha Solidária** é uma ONG fictícia de proteção animal, fundada em 2026 e com atuação 100% online, criada para demonstrar como uma plataforma moderna pode ajudar o terceiro setor a:

- divulgar animais para **adoção**;
- **captar doações** com transparência sobre cada projeto;
- **engajar voluntários** com um cadastro simples e seguro.

> Projeto acadêmico desenvolvido na disciplina **Desenvolvimento Front-end** (Experiências Práticas I a IV).

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🏠 **Início** | Hero com rastro de patinhas no mouse, contadores animados e meta coletiva de doação em tempo real |
| 💛 **Modo match** | Adoção no estilo "arrastar para o lado": direita = match, esquerda = próximo (também funciona com botões e setas do teclado) |
| 🔎 **Lista de pets** | Filtros por espécie, porte e idade + busca por nome |
| 🐶 **Perfil do pet** | Rota dinâmica `#/pet/:id` com história, ficha, compatibilidade e pedido de adoção |
| 📊 **Projetos** | 4 metas com barras de progresso, modal de doação simulada e histórico do usuário |
| ✨ **Quiz** | "Qual pet combina com você?", com 5 perguntas e ranking por pontuação |
| 🤝 **Voluntário** | Formulário com máscaras (CPF, telefone, CEP), validação do CPF, idade mínima, endereço automático via ViaCEP e rascunho salvo automaticamente |
| 💾 **Persistência** | Matches, doações, cadastros, pedidos e quiz salvos no `localStorage` |
| 🎉 **Celebrações** | Confetes nas conquistas (biblioteca canvas-confetti, com fallback offline) |

## 🛠 Tecnologias

- **HTML5 semântico**: landmarks, formulários acessíveis e fragmentos carregados via `fetch`
- **CSS3**: Design System com variáveis, Grid de 12 colunas, Flexbox, 5 breakpoints e animações
- **JavaScript (ES6+)**: ES Modules, SPA com roteamento por hash, templates com Template Literals, `localStorage`, `fetch` + `async/await`
- **APIs e bibliotecas externas**: [ViaCEP](https://viacep.com.br) e [canvas-confetti](https://github.com/catdad/canvas-confetti) (CDN jsDelivr)
- **Testes**: executor nativo do Node.js (`node:test` + `node:assert`), sem dependências
- **Build**: [esbuild](https://esbuild.github.io/) para unir e minificar JavaScript e CSS
- **Ferramentas**: VS Code, Live Server, Node.js, Git, GitHub e GitHub Pages

## 📁 Estrutura de pastas

```
patinha-solidaria/            ← raiz do repositório
├── README.md                 ← este arquivo
├── .gitignore
├── package.json              ← scripts de teste e build
├── scripts/build.mjs         ← gera a versão de produção
├── testes/                   ← testes automatizados (validadores e máscaras)
├── docs/                     ← build de produção publicado no GitHub Pages (gerado)
└── patinha-solidaria/        ← código-fonte da aplicação
    ├── index.html            ← casca da SPA (header, footer, modal e <main id="app">)
    ├── html/                 ← fragmentos carregados sob demanda (termo, privacidade)
    ├── css/style.css         ← Design System, layout e componentes
    ├── imagens/              ← logo e ilustrações dos pets (SVG)
    └── js/
        ├── main.js           ← ponto de entrada: inicializa os módulos
        ├── router.js         ← navegação da SPA (#/rota/parametro?filtro=x)
        ├── paginas/          ← uma tela por arquivo, cada uma com render() e init()
        ├── componentes/      ← modal, toast, alerta, menu, templates, doações, matches, efeitos
        ├── utils/            ← storage, validadores, máscaras, DOM, biblioteca externa
        └── dados/            ← pets.js e projetos.js
```

## ▶️ Como executar

**Pré-requisitos:** [VS Code](https://code.visualstudio.com/) com a extensão **Live Server** (Ritwick Dey) e [Git](https://git-scm.com/). Para testes e build, também é necessário o [Node.js](https://nodejs.org/) 20 ou superior.

```bash
# 1. Clone o repositório
git clone https://github.com/anjosp-dev/patinha-solidaria.git

# 2. Abra a pasta no VS Code
code patinha-solidaria
```

3. Abra `patinha-solidaria/index.html`, clique com o botão direito e escolha **Open with Live Server**.

> ⚠️ **Importante:** o projeto usa ES Modules (`type="module"`), que só funcionam via HTTP. Abrir o `index.html` com dois cliques (`file://`) deixa a página em branco.

Para apenas **rodar o site**, não há dependências: tudo funciona direto no navegador.

## 🧪 Testes

As regras de validação (CPF, e-mail, telefone, CEP, idade mínima) e as máscaras de entrada são funções puras cobertas por **11 testes automatizados**, que usam o executor nativo do Node.js.

```bash
npm test
```

Resultado esperado: `# tests 11 · # pass 11 · # fail 0`.

Testes manuais recomendados antes de cada versão: navegar por todas as rotas, usar o site só com o teclado, enviar formulários vazios e com dados inválidos, recarregar a página para conferir o `localStorage` e verificar o console do DevTools (sem erros).

## 🚀 Build de produção e deploy

```bash
npm install     # instala o esbuild (apenas na primeira vez)
npm run build   # gera a pasta docs/
```

O build:

1. une os 26 módulos JavaScript em um único `app.min.js` minificado (menos requisições);
2. minifica o CSS em `style.min.css`;
3. otimiza os SVGs (remove espaços e comentários e limita casas decimais);
4. gera um `index.html` apontando para os arquivos otimizados;
5. cria `.nojekyll` para o GitHub Pages.

**Deploy:** a pasta `docs/` é publicada pelo **GitHub Pages** (Settings › Pages › Branch `main` › pasta `/docs`). Cada merge na `main` com um novo build atualiza o site automaticamente.

## 🧭 Como usar

| Rota | Tela |
|---|---|
| `#/inicio` | Página inicial |
| `#/adotar` | Modo match + lista de pets (aceita `?especie=cao` ou `?especie=gato`) |
| `#/pet/3` | Perfil de um pet específico |
| `#/projetos` | Projetos, metas e histórico de doações |
| `#/quiz` | Quiz de compatibilidade |
| `#/voluntario` | Cadastro de voluntário |
| `#/matches` | Pets favoritados |

**Atalhos de teclado:** `Tab` navega, `Esc` fecha menu e modal, `←` e `→` decidem o match.

**Para limpar os dados de teste:** DevTools (`F12`) › Application › Local Storage › apagar as chaves que começam com `patinha:`.

## 🏗 Arquitetura

- **Roteamento:** `router.js` escuta o evento `hashchange`, separa rota e parâmetros, injeta `pagina.render(params)` em `<main id="app">` e chama `pagina.init(app, params)`. A função de limpeza devolvida pelo `init` é executada antes da próxima troca de tela, evitando ouvintes duplicados.
- **Templates:** funções puras em `componentes/templates.js` (`cardPet`, `cardProjeto`, `barraProjeto`) que recebem dados e devolvem HTML.
- **Estado:** `utils/storage.js` centraliza o `localStorage` (prefixo `patinha:` e `try/catch`) e oferece um sistema de avisos (`aoMudar` / `avisar`) para atualizar a interface quando os dados mudam.
- **Validação:** regras declaradas no HTML com `data-regras="obrigatorio cpf"` e aplicadas por `validarCampo()`.
- **Direção das dependências:** `paginas → componentes → utils → dados` (nunca o contrário).

## 🌿 Fluxo de versionamento (GitFlow)

| Branch | Função |
|---|---|
| `main` | Código estável, em produção. Só recebe merge de `develop` ou de `hotfix/*` |
| `develop` | Integração das funcionalidades em desenvolvimento |
| `feature/*` | Uma branch por funcionalidade, criada a partir de `develop` (ex.: `feature/acessibilidade`) |
| `release/*` | Preparação de uma versão para produção (build e ajustes finais) |
| `hotfix/*` | Correções urgentes a partir de `main` |

**Fluxo:** `feature/*` → Pull Request → revisão → merge em `develop` → `release/*` → merge em `main` → deploy.

## 📝 Padrão de commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

| Tipo | Uso | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade | `feat: adiciona quiz de compatibilidade` |
| `fix` | Correção de bug | `fix: corrige caminhos das imagens para a pasta imagens/` |
| `docs` | Documentação | `docs: completa o README` |
| `style` | Formatação, sem mudar lógica | `style: padroniza indentação do CSS` |
| `refactor` | Reestruturação sem mudar comportamento | `refactor: separa validadores em módulo próprio` |
| `perf` | Melhoria de desempenho | `perf: minifica CSS e JS para produção` |
| `chore` | Tarefas de configuração | `chore: adiciona .gitignore` |

Escopo opcional entre parênteses, por exemplo: `feat(a11y): adequa o site às diretrizes WCAG 2.1 AA`.

## ♿ Acessibilidade

O projeto segue a **WCAG 2.1 nível AA**:

- contraste mínimo de 4,5:1 em todo o texto (paleta verificada);
- **barra de acessibilidade** com modo de **alto contraste** (preto, branco e amarelo, ativado automaticamente se o sistema pedir `prefers-contrast: more`) e ajuste do **tamanho do texto** de 100% a 137,5%, com as preferências salvas no navegador;
- navegação completa por teclado, com foco visível e link "Pular para o conteúdo";
- foco levado ao conteúdo a cada troca de rota e título da aba atualizado;
- modal com `role="dialog"`, `aria-modal` e foco preso enquanto está aberto;
- formulários com `label`, `aria-required`, `aria-invalid` e mensagens ligadas por `aria-describedby`;
- alternativa em botões para o gesto de arrastar do modo match;
- respeito a `prefers-reduced-motion` (animações e confetes desativados).

## 🔧 Manutenção

**Adicionar um pet:** inclua um objeto no array de `js/dados/pets.js` e a ilustração em `imagens/pets/`. O card aparece automaticamente em todas as telas.

**Adicionar um projeto:** inclua um objeto em `js/dados/projetos.js` com `id`, `titulo`, `meta` e `arrecadadoBase`.

**Criar uma nova página:**
1. Crie `js/paginas/nova.js` exportando `{ titulo, render(params), init(app, params) }`.
2. Importe e registre em `ROTAS`, no `js/router.js`.
3. Adicione o link no menu do `index.html` com `href="#/nova"` e `data-rota="nova"`.

**Mudar cores, fontes ou espaçamentos:** altere as variáveis em `:root`, no início do `css/style.css`.

## 👤 Autor

**Yuri Pereira** · [@anjosp-dev](https://github.com/anjosp-dev)

Projeto acadêmico, sem fins comerciais. Dados de pets, projetos e doações são fictícios.
