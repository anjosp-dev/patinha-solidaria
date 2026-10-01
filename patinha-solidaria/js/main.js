/* =========================================================
   Patinha Solidária - ponto de entrada da aplicação
   Cada funcionalidade vive em seu próprio módulo.
   ========================================================= */
import { iniciarRouter } from "./router.js";
import { iniciarMenu } from "./componentes/menu.js";
import { iniciarModal } from "./componentes/modal.js";
import { iniciarMatches } from "./componentes/matches.js";
import { iniciarDoacoes } from "./componentes/doacoes.js";
import { iniciarEfeitosGlobais } from "./componentes/efeitos.js";
import "./componentes/alerta.js";
import { preCarregar } from "./utils/celebrar.js";
import { iniciarAcessibilidade } from "./componentes/acessibilidade.js";

document.addEventListener("DOMContentLoaded", () => {
  iniciarAcessibilidade();
  iniciarMenu();
  iniciarModal();
  iniciarMatches();
  iniciarDoacoes();
  iniciarEfeitosGlobais();
  iniciarRouter();
  preCarregar();

  /* Acessibilidade: o link "Pular para o conteúdo" não pode mudar o hash,
     senão o router tentaria abrir a rota "#app" (página 404) */
  document.querySelector(".pular-link").addEventListener("click", (e) => {
    e.preventDefault();
    const app = document.getElementById("app");
    app.focus();
    app.scrollIntoView();
  });
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
});
