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

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarModal();
  iniciarMatches();
  iniciarDoacoes();
  iniciarEfeitosGlobais();
  iniciarRouter();
  preCarregar();
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));
});
