/* =========================================================
   Utilitários de DOM e formatação
   ========================================================= */
export const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
export const $$ = (seletor, contexto = document) => Array.from(contexto.querySelectorAll(seletor));

export const moeda = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* Evita que textos digitados pelo usuário virem HTML (proteção contra XSS) */
export const escaparHTML = (texto = "") =>
  String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const reduzirMovimento = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
