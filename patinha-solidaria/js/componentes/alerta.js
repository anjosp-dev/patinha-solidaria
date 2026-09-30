/* =========================================================
   Alertas contextuais (inseridos dentro da página)
   ========================================================= */
import { escaparHTML } from "../utils/dom.js";

const ICONES = { sucesso: "✓", erro: "!", aviso: "⚠", info: "i" };

export function alertaHTML(tipo, titulo, texto) {
  return `
  <div class="alerta alerta--${tipo}" role="${tipo === "erro" ? "alert" : "status"}">
    <span class="alerta__icone" aria-hidden="true">${ICONES[tipo]}</span>
    <p class="alerta__texto"><strong>${escaparHTML(titulo)}</strong><span>${escaparHTML(texto)}</span></p>
    <button class="alerta__fechar" aria-label="Fechar alerta">✕</button>
  </div>`;
}

/* Fecha qualquer alerta pelo botão ✕ (delegação de eventos) */
document.addEventListener("click", (e) => {
  const botao = e.target.closest(".alerta__fechar");
  if (!botao) return;
  const alerta = botao.closest(".alerta");
  alerta.classList.add("alerta--saindo");
  setTimeout(() => alerta.remove(), 300);
});
