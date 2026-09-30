/* =========================================================
   Toasts: notificações rápidas e não obstrutivas
   ========================================================= */
import { escaparHTML } from "../utils/dom.js";

const ICONES = { sucesso: "✓", erro: "!", info: "🐾" };

export function toast(titulo, texto = "", tipo = "sucesso", tempo = 3800) {
  const area = document.querySelector(".toasts");
  const el = document.createElement("div");
  el.className = `toast toast--${tipo}`;
  el.innerHTML = `
    <span class="toast__icone" aria-hidden="true">${ICONES[tipo] || "✓"}</span>
    <p class="toast__texto"><strong>${escaparHTML(titulo)}</strong>${texto ? `<small>${escaparHTML(texto)}</small>` : ""}</p>
    <button class="toast__fechar" aria-label="Fechar notificação">✕</button>
    <span class="toast__barra" style="animation-duration:${tempo}ms"></span>`;
  area.appendChild(el);
  const fechar = () => {
    el.classList.add("toast--saindo");
    setTimeout(() => el.remove(), 300);
  };
  el.querySelector("button").addEventListener("click", fechar);
  setTimeout(fechar, tempo);
}
