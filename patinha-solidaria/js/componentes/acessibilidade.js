/* =========================================================
   Barra de acessibilidade: alto contraste e tamanho do texto
   As preferências ficam salvas no localStorage.
   ========================================================= */
import { ler, salvar } from "../utils/storage.js";
import { $, $$ } from "../utils/dom.js";
import { toast } from "./toast.js";

const CHAVE = "preferencias-a11y";
const ESCALAS = [100, 112.5, 125, 137.5]; /* % do tamanho base da fonte */
const html = document.documentElement;

function aplicar(pref) {
  html.dataset.contraste = pref.contraste ? "alto" : "normal";
  html.style.fontSize = ESCALAS[pref.fonte] + "%";
  const botao = $('[data-a11y="contraste"]');
  botao.setAttribute("aria-pressed", String(pref.contraste));
  $('[data-a11y="fonte-menos"]').disabled = pref.fonte === 0;
  $('[data-a11y="fonte-mais"]').disabled = pref.fonte === ESCALAS.length - 1;
  $("[data-a11y-escala]").textContent = ESCALAS[pref.fonte] + "%";
}

export function iniciarAcessibilidade() {
  /* Se o usuário nunca escolheu, segue a preferência do sistema operacional */
  const sistemaPedeContraste = window.matchMedia("(prefers-contrast: more), (forced-colors: active)").matches;
  const pref = ler(CHAVE, { contraste: sistemaPedeContraste, fonte: 0 });
  aplicar(pref);

  $$("[data-a11y]").forEach((botao) => botao.addEventListener("click", () => {
    const acao = botao.dataset.a11y;
    if (acao === "contraste") {
      pref.contraste = !pref.contraste;
      toast(pref.contraste ? "Alto contraste ativado" : "Alto contraste desativado", "", "info", 2000);
    }
    if (acao === "fonte-mais") pref.fonte = Math.min(ESCALAS.length - 1, pref.fonte + 1);
    if (acao === "fonte-menos") pref.fonte = Math.max(0, pref.fonte - 1);
    salvar(CHAVE, pref);
    aplicar(pref);
  }));
}
