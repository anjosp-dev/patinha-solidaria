/* =========================================================
   Doações simuladas: soma por projeto e histórico
   ========================================================= */
import { ler, salvar, avisar, CHAVES } from "../utils/storage.js";
import { PROJETOS } from "../dados/projetos.js";
import { moeda, $, $$ } from "../utils/dom.js";
import { abrirModal, fecharModal } from "./modal.js";
import { toast } from "./toast.js";
import { celebrarGrande } from "../utils/celebrar.js";

export const listarDoacoes = () => ler(CHAVES.DOACOES, []);

export function arrecadado(projetoId) {
  const projeto = PROJETOS.find((p) => p.id === projetoId);
  const extra = listarDoacoes().filter((d) => d.projeto === projetoId).reduce((s, d) => s + d.valor, 0);
  return projeto.arrecadadoBase + extra;
}

export function totais() {
  const meta = PROJETOS.reduce((s, p) => s + p.meta, 0);
  const total = PROJETOS.reduce((s, p) => s + arrecadado(p.id), 0);
  return { meta, total, porcentagem: Math.min(100, Math.round((total / meta) * 100)) };
}

function registrar(projeto, valor) {
  const lista = listarDoacoes();
  lista.unshift({ id: Date.now(), projeto, valor, data: new Date().toISOString() });
  salvar(CHAVES.DOACOES, lista);
  avisar(CHAVES.DOACOES, lista);
}

export function abrirDoacao(projetoInicial = "resgate") {
  const opcoesProjeto = PROJETOS.map((p) =>
    `<option value="${p.id}" ${p.id === projetoInicial ? "selected" : ""}>${p.icone} ${p.titulo}</option>`).join("");
  abrirModal({
    titulo: "Fazer uma doação 💛",
    conteudo: `
      <form class="form-doacao" novalidate>
        <div class="form__grupo">
          <label class="form__rotulo" for="doacao-projeto">Para qual projeto?</label>
          <select class="form__campo" id="doacao-projeto">${opcoesProjeto}</select>
        </div>
        <fieldset class="form__grupo">
          <legend class="form__rotulo">Valor da doação</legend>
          <div class="chips">
            ${[20, 50, 100, 200].map((v, i) => `
              <label class="chip"><input type="radio" name="valor" value="${v}" ${i === 1 ? "checked" : ""}><span>${moeda(v)}</span></label>`).join("")}
            <label class="chip"><input type="radio" name="valor" value="outro"><span>Outro valor</span></label>
          </div>
        </fieldset>
        <div class="form__grupo" data-outro-valor hidden>
          <label class="form__rotulo" for="doacao-outro">Digite o valor (mínimo R$ 5)</label>
          <input class="form__campo" id="doacao-outro" type="number" min="5" step="1" placeholder="Ex.: 35">
          <p class="form__erro" id="doacao-erro"></p>
        </div>
        <p class="doacao-impacto" aria-live="polite"></p>
        <div class="modal__acoes">
          <button type="button" class="btn btn--contorno" data-fechar-modal>Cancelar</button>
          <button type="submit" class="btn btn--destaque">Confirmar doação</button>
        </div>
        <p class="texto-sm texto-suave">* Doação simulada para fins acadêmicos. Nenhum valor é cobrado.</p>
      </form>`,
    aoAbrir(corpo) {
      const form = $("form", corpo);
      const outro = $("[data-outro-valor]", corpo);
      const impacto = $(".doacao-impacto", corpo);
      const valorAtual = () => {
        const escolhido = $('input[name="valor"]:checked', form).value;
        return escolhido === "outro" ? Number($("#doacao-outro", corpo).value) : Number(escolhido);
      };
      const atualizar = () => {
        outro.hidden = $('input[name="valor"]:checked', form).value !== "outro";
        const v = valorAtual() || 0;
        impacto.textContent = v >= 5 ? `🐾 Com ${moeda(v)} você garante cerca de ${Math.max(1, Math.floor(v / 4))} refeições para um pet resgatado.` : "";
      };
      form.addEventListener("input", atualizar);
      form.addEventListener("change", atualizar);
      atualizar();
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const valor = valorAtual();
        const erro = $("#doacao-erro", corpo);
        if (!valor || valor < 5) {
          outro.classList.add("form__grupo--erro");
          erro.textContent = "Informe um valor de pelo menos R$ 5,00.";
          $("#doacao-outro", corpo).focus();
          return;
        }
        const projeto = $("#doacao-projeto", corpo).value;
        registrar(projeto, valor);
        fecharModal();
        celebrarGrande();
        const nome = PROJETOS.find((p) => p.id === projeto).titulo;
        toast(`Obrigado pela doação de ${moeda(valor)}!`, `Destinada ao projeto ${nome}.`, "sucesso", 5000);
      });
    }
  });
}

/* Botões [data-doar] em qualquer página abrem o modal */
export function iniciarDoacoes() {
  document.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-doar]");
    if (botao) abrirDoacao(botao.dataset.doar || "resgate");
  });
}

/* Atualiza barras e valores visíveis na tela (usado pelas páginas) */
export function atualizarBarras(contexto = document) {
  $$("[data-barra-projeto]", contexto).forEach((barra) => {
    const p = PROJETOS.find((x) => x.id === barra.dataset.barraProjeto);
    const valor = arrecadado(p.id);
    const pct = Math.min(100, Math.round((valor / p.meta) * 100));
    barra.querySelector(".progresso__barra").style.width = pct + "%";
    barra.querySelector("[data-valor]").textContent = moeda(valor);
    barra.querySelector("[data-pct]").textContent = pct + "%";
  });
  const t = totais();
  $$("[data-meta-geral]", contexto).forEach((el) => {
    el.querySelector(".progresso__barra").style.width = t.porcentagem + "%";
    el.querySelector("[data-valor]").textContent = moeda(t.total);
    el.querySelector("[data-pct]").textContent = t.porcentagem + "%";
  });
}
