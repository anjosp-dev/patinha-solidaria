/* =========================================================
   Modal genérico e acessível
   abrirModal({ titulo, conteudo, aoAbrir })
   ========================================================= */
import { $ } from "../utils/dom.js";

let focoAnterior = null;
const modal = () => $("#modal");

export function abrirModal({ titulo, conteudo, aoAbrir }) {
  const m = modal();
  focoAnterior = document.activeElement;
  $("#modal-titulo", m).textContent = titulo;
  $(".modal__corpo", m).innerHTML = conteudo;
  m.classList.add("modal--aberto");
  m.setAttribute("aria-hidden", "false");
  document.body.classList.add("sem-scroll");
  if (aoAbrir) aoAbrir($(".modal__corpo", m));
  setTimeout(() => $(".modal__fechar", m).focus(), 50);
}

export function fecharModal() {
  const m = modal();
  if (!m.classList.contains("modal--aberto")) return;
  m.classList.remove("modal--aberto");
  m.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sem-scroll");
  if (focoAnterior) focoAnterior.focus();
}

export function iniciarModal() {
  const m = modal();
  m.addEventListener("click", (e) => {
    if (e.target === m || e.target.closest("[data-fechar-modal]")) fecharModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
    /* Mantém o foco preso dentro do modal enquanto ele está aberto */
    if (e.key === "Tab" && m.classList.contains("modal--aberto")) {
      const focaveis = Array.from(m.querySelectorAll("button, a, input, select, textarea")).filter((el) => !el.disabled);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });
}

/* Carrega um fragmento da pasta /html e mostra no modal.
   Uso: <button data-carregar-html="html/arquivo.html" data-titulo="Título"> */
export async function abrirHTML(url, titulo) {
  abrirModal({ titulo, conteudo: `<p class="texto-suave">Carregando...</p>` });
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(resposta.status);
    document.querySelector("#modal .modal__corpo").innerHTML = await resposta.text();
  } catch (erro) {
    document.querySelector("#modal .modal__corpo").innerHTML =
      `<p>Não foi possível carregar o conteúdo. Abra o site pelo Live Server e tente de novo.</p>`;
  }
}

document.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-carregar-html]");
  if (!botao) return;
  e.preventDefault();
  abrirHTML(botao.dataset.carregarHtml, botao.dataset.titulo || "Informações");
});
