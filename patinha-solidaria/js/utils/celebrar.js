/* =========================================================
   Integração com biblioteca externa: canvas-confetti
   https://github.com/catdad/canvas-confetti
   A biblioteca é carregada sob demanda (import dinâmico via CDN).
   Se a internet cair ou a CDN falhar, o site continua funcionando.
   ========================================================= */
import { reduzirMovimento } from "./dom.js";

const URL_CONFETTI = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/+esm";
const CORES = ["#E8A33D", "#2F4F3E", "#EFEAE0", "#F4C27A", "#DDE6DF"];
let confetti = null;

async function carregar() {
  if (confetti) return confetti;
  try {
    confetti = (await import(URL_CONFETTI)).default;
  } catch (erro) {
    console.warn("[celebrar] Biblioteca de confetes indisponível:", erro.message);
    confetti = () => {}; /* fallback: não faz nada */
  }
  return confetti;
}

/* Explosão simples, a partir de um elemento ou do centro da tela */
export async function celebrar(origemEl) {
  if (reduzirMovimento()) return;
  const disparar = await carregar();
  let origin = { x: 0.5, y: 0.6 };
  if (origemEl) {
    const r = origemEl.getBoundingClientRect();
    origin = { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight };
  }
  disparar({ particleCount: 90, spread: 75, startVelocity: 38, origin, colors: CORES, scalar: 0.9 });
}

/* Chuva lateral mais longa, para grandes conquistas */
export async function celebrarGrande() {
  if (reduzirMovimento()) return;
  const disparar = await carregar();
  const fim = Date.now() + 1200;
  (function quadro() {
    disparar({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: CORES });
    disparar({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: CORES });
    if (Date.now() < fim) requestAnimationFrame(quadro);
  })();
}

/* Pré-carrega em segundo plano para a primeira celebração ser instantânea */
export function preCarregar() {
  ("requestIdleCallback" in window ? requestIdleCallback : setTimeout)(() => carregar());
}
