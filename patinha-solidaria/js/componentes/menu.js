/* =========================================================
   Menu principal: hambúrguer, submenu e link ativo
   ========================================================= */
import { $, $$ } from "../utils/dom.js";

export function iniciarMenu() {
  const nav = $(".nav");
  const toggle = $(".nav__toggle");

  const alternar = (abrir) => {
    const aberto = abrir ?? !nav.classList.contains("nav--aberto");
    nav.classList.toggle("nav--aberto", aberto);
    toggle.setAttribute("aria-expanded", String(aberto));
    toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("sem-scroll", aberto);
  };

  toggle.addEventListener("click", () => alternar());
  $(".nav__overlay").addEventListener("click", () => alternar(false));
  $$(".nav__lista a").forEach((a) => a.addEventListener("click", () => alternar(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") alternar(false); });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (m) => m.matches && alternar(false));

  $$(".submenu__toggle").forEach((btn) => btn.addEventListener("click", () => {
    const item = btn.closest(".nav__item");
    btn.setAttribute("aria-expanded", String(item.classList.toggle("submenu--aberto")));
  }));
}

/* Chamado pelo router a cada troca de página */
export function marcarLinkAtivo(rota) {
  $$(".nav__link[data-rota]").forEach((link) => {
    const ativo = link.dataset.rota === rota;
    link.classList.toggle("nav__link--ativo", ativo);
    ativo ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
  });
}
