# Patinha Solidária 🐾

Single Page Application (SPA) da ONG Patinha Solidária, de proteção animal.
Projeto acadêmico da disciplina de Desenvolvimento Front-end (Experiência Prática III).

## Como executar

O projeto usa **ES6 Modules** (`import`/`export`), que só funcionam quando servidos por HTTP.
Abrir o `index.html` com dois cliques (protocolo `file://`) deixa a página em branco.

1. Abra a pasta `patinha-solidaria` no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito no `index.html` e escolha **Open with Live Server**.

## Estrutura

```
patinha-solidaria/
├── index.html          → casca da SPA (header, footer, modal e <main id="app">)
├── html/               → fragmentos carregados com fetch (termo, privacidade)
├── css/style.css       → Design System, Grid, Flexbox e breakpoints
├── imagens/            → logo e ilustrações dos pets (SVG)
└── js/
    ├── main.js         → ponto de entrada, inicializa os módulos
    ├── router.js       → navegação por hash (#/rota)
    ├── paginas/        → uma tela por arquivo (render + init)
    ├── componentes/    → modal, toast, alerta, menu, templates, doações, matches
    ├── utils/          → storage, validadores, máscaras, DOM, biblioteca externa
    └── dados/          → pets e projetos
```

## Rotas

| Rota | Tela |
|---|---|
| `#/inicio` | Página inicial |
| `#/adotar` | Modo match + lista com filtros |
| `#/pet/:id` | Perfil do pet e pedido de adoção |
| `#/projetos` | Metas, doações e histórico |
| `#/quiz` | Quiz "Qual pet combina com você?" |
| `#/voluntario` | Cadastro de voluntário |
| `#/matches` | Pets favoritados |

## Tecnologias

HTML5, CSS3, JavaScript (ES6 Modules), localStorage, API ViaCEP e biblioteca canvas-confetti (CDN).
