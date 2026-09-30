/* =========================================================
   Router da SPA (navegação por hash: #/rota/parametro?filtro=x)
   Troca o conteúdo do <main id="app"> sem recarregar a página.
   ========================================================= */
import inicio from "./paginas/inicio.js";
import adotar from "./paginas/adotar.js";
import pet from "./paginas/pet.js";
import matches from "./paginas/matches.js";
import projetos from "./paginas/projetos.js";
import quiz from "./paginas/quiz.js";
import voluntario from "./paginas/voluntario.js";
import naoEncontrada from "./paginas/nao-encontrada.js";
import { marcarLinkAtivo } from "./componentes/menu.js";
import { observarRevelacoes } from "./componentes/efeitos.js";

/* Tabela de rotas: nome da rota → módulo da página */
const ROTAS = { inicio, adotar, pet, matches, projetos, quiz, voluntario };

let limparPaginaAtual = null;
let primeiraRenderizacao = true;

/* Lê o hash e separa rota, id e parâmetros.
   Ex.: "#/pet/3"            → { rota: "pet", params: { id: "3" } }
        "#/adotar?especie=gato" → { rota: "adotar", params: { especie: "gato" } } */
export function lerHash() {
  const [caminho, busca = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const [rota = "inicio", id] = caminho.split("/");
  const params = Object.fromEntries(new URLSearchParams(busca));
  if (id) params.id = id;
  return { rota: rota || "inicio", params };
}

function renderizar() {
  const app = document.getElementById("app");
  const { rota, params } = lerHash();
  const pagina = ROTAS[rota] || naoEncontrada;

  /* 1. limpa ouvintes da página anterior */
  if (typeof limparPaginaAtual === "function") limparPaginaAtual();
  limparPaginaAtual = null;

  /* 2. transição de saída e injeção do novo template */
  app.classList.remove("app--entrando");
  app.innerHTML = pagina.render(params);
  void app.offsetWidth; /* reinicia a animação */
  app.classList.add("app--entrando");

  /* 3. título da aba, link ativo e acessibilidade */
  const titulo = typeof pagina.titulo === "function" ? pagina.titulo(params) : pagina.titulo;
  document.title = `${titulo} | Patinha Solidária`;
  marcarLinkAtivo(rota);
  window.scrollTo({ top: 0, behavior: "instant" });
  /* Acessibilidade: nas trocas de página, o foco vai para o conteúdo novo
     (leitores de tela anunciam a mudança). Na primeira carga, não, para que
     o primeiro Tab encontre o link "Pular para o conteúdo". */
  if (!primeiraRenderizacao) app.focus({ preventScroll: true });
  primeiraRenderizacao = false;

  /* 4. ativa os comportamentos da página */
  if (pagina.init) limparPaginaAtual = pagina.init(app, params);
  observarRevelacoes(app);
}

export function iniciarRouter() {
  window.addEventListener("hashchange", renderizar);
  if (!location.hash) history.replaceState(null, "", "#/inicio");
  renderizar();
}
