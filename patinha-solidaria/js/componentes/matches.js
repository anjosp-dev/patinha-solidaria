/* =========================================================
   Matches (pets favoritados) salvos no localStorage
   ========================================================= */
import { ler, salvar, avisar, aoMudar, CHAVES } from "../utils/storage.js";
import { $$ } from "../utils/dom.js";
import { buscarPet } from "../dados/pets.js";
import { toast } from "./toast.js";
import { celebrar } from "../utils/celebrar.js";

export const listarMatches = () => ler(CHAVES.MATCHES, []);
export const temMatch = (id) => listarMatches().includes(Number(id));

export function alternarMatch(id, forcar) {
  const lista = listarMatches();
  const numero = Number(id);
  const jaTem = lista.includes(numero);
  const adicionar = forcar ?? !jaTem;
  const nova = adicionar ? [...new Set([...lista, numero])] : lista.filter((i) => i !== numero);
  salvar(CHAVES.MATCHES, nova);
  avisar(CHAVES.MATCHES, nova);
  const pet = buscarPet(numero);
  if (adicionar && !jaTem) celebrar(document.querySelector(`[data-match="${numero}"]`));
  if (adicionar && !jaTem) toast(`Match com ${pet.nome}! 💛`, "Salvo na sua lista de matches.", "info");
  if (!adicionar && jaTem) toast(`${pet.nome} saiu dos seus matches`, "", "sucesso", 2200);
  return adicionar;
}

/* Atualiza o contador do menu sempre que a lista muda */
function atualizarContador(lista) {
  $$("[data-contador-matches]").forEach((el) => {
    el.textContent = lista.length;
    el.hidden = lista.length === 0;
  });
}

export function iniciarMatches() {
  atualizarContador(listarMatches());
  aoMudar(CHAVES.MATCHES, atualizarContador);

  /* Delegação: qualquer botão [data-match] na tela funciona, mesmo os criados depois */
  document.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-match]");
    if (!botao) return;
    const ativo = alternarMatch(botao.dataset.match);
    $$(`[data-match="${botao.dataset.match}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", String(ativo));
      b.classList.toggle("btn-match--ativo", ativo);
    });
  });
}
