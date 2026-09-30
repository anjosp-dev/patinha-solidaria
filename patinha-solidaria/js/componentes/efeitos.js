/* =========================================================
   Efeitos visuais globais: cabeçalho, voltar ao topo,
   animações ao rolar, contadores e rastro de patinhas
   ========================================================= */
import { $, $$, reduzirMovimento } from "../utils/dom.js";

export function iniciarEfeitosGlobais() {
  const header = $(".header");
  const topo = $(".topo-btn");
  const aoRolar = () => {
    header.classList.toggle("header--rolado", window.scrollY > 20);
    topo.classList.toggle("topo-btn--visivel", window.scrollY > 600);
  };
  window.addEventListener("scroll", aoRolar, { passive: true });
  topo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  aoRolar();
}

/* Revela elementos .revelar e anima [data-contador] quando entram na tela.
   Precisa rodar a cada renderização de página. */
let observador;
export function observarRevelacoes(contexto) {
  observador?.disconnect();
  observador = new IntersectionObserver((entradas) => {
    entradas.forEach((ent) => {
      if (!ent.isIntersecting) return;
      ent.target.classList.add("revelar--visivel");
      if (ent.target.dataset.contador) animarContador(ent.target);
      if (ent.target.dataset.progresso) ent.target.style.width = ent.target.dataset.progresso + "%";
      observador.unobserve(ent.target);
    });
  }, { threshold: 0.15 });
  $$(".revelar, [data-contador], [data-progresso]", contexto).forEach((el) => observador.observe(el));
}

export function animarContador(el) {
  const alvo = Number(el.dataset.contador);
  const prefixo = el.dataset.prefixo || "";
  const sufixo = el.dataset.sufixo || "";
  const inicio = performance.now();
  const duracao = reduzirMovimento() ? 1 : 1600;
  const passo = (agora) => {
    const t = Math.min(1, (agora - inicio) / duracao);
    const valor = Math.floor(alvo * (1 - Math.pow(1 - t, 3)));
    el.textContent = prefixo + valor.toLocaleString("pt-BR") + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/* Rastro de patinhas que segue o mouse dentro do hero */
export function rastroDePatinhas(area) {
  if (!area || reduzirMovimento() || !window.matchMedia("(hover: hover)").matches) return;
  let ultimo = 0;
  let lado = 1;
  area.addEventListener("mousemove", (e) => {
    const agora = performance.now();
    if (agora - ultimo < 90) return;
    ultimo = agora;
    const r = area.getBoundingClientRect();
    const pata = document.createElement("span");
    pata.className = "pegada";
    pata.textContent = "🐾";
    lado *= -1;
    pata.style.left = e.clientX - r.left + lado * 8 + "px";
    pata.style.top = e.clientY - r.top + "px";
    pata.style.setProperty("--giro", Math.round(Math.random() * 60 - 30) + "deg");
    area.appendChild(pata);
    setTimeout(() => pata.remove(), 1200);
  });
}
