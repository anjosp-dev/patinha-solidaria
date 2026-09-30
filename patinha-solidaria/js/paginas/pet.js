/* Página: Perfil do pet (rota dinâmica #/pet/:id) */
import { buscarPet, ROTULOS, PETS } from "../dados/pets.js";
import { temMatch } from "../componentes/matches.js";
import { cardPet } from "../componentes/templates.js";
import { abrirModal, fecharModal } from "../componentes/modal.js";
import { toast } from "../componentes/toast.js";
import { celebrarGrande } from "../utils/celebrar.js";
import { aplicarMascaras } from "../utils/mascaras.js";
import { validarCampo } from "../utils/validadores.js";
import { ler, salvar, CHAVES } from "../utils/storage.js";
import { $, $$, escaparHTML } from "../utils/dom.js";
import naoEncontrada from "./nao-encontrada.js";

export default {
  titulo: (params) => buscarPet(params.id)?.nome || "Pet não encontrado",
  render(params) {
    const pet = buscarPet(params.id);
    if (!pet) return naoEncontrada.render();
    const ativo = temMatch(pet.id);
    const pedido = ler(CHAVES.PEDIDOS_ADOCAO, []).find((p) => p.petId === pet.id);
    const outros = PETS.filter((p) => p.id !== pet.id && p.especie === pet.especie).slice(0, 3);
    return `
    <section class="container perfil">
      <nav class="migalhas" aria-label="Você está em"><a href="#/inicio">Início</a> › <a href="#/adotar">Adotar</a> › <span aria-current="page">${pet.nome}</span></nav>
      <div class="perfil__grid">
        <div class="perfil__foto revelar"><img src="${pet.img}" alt="Ilustração de ${pet.nome}" width="400" height="400"></div>
        <div class="perfil__info revelar">
          <span class="badge badge--${pet.especie}">${pet.especie === "cao" ? "🐶" : "🐱"} ${ROTULOS.especie[pet.especie]}</span>
          <h1>${pet.nome}</h1>
          <dl class="ficha">
            <div><dt>Sexo</dt><dd>${pet.sexo}</dd></div>
            <div><dt>Idade</dt><dd>${pet.idadeTexto}</dd></div>
            <div><dt>Porte</dt><dd>${ROTULOS.porte[pet.porte]}</dd></div>
            <div><dt>Energia</dt><dd aria-label="${pet.energia} de 3">${"⚡".repeat(pet.energia)}${"<span class='apagado'>⚡</span>".repeat(3 - pet.energia)}</dd></div>
          </dl>
          <h2 class="perfil__subtitulo">Minha história</h2>
          <p>${pet.historia}</p>
          <ul class="tags">${pet.tags.map((t) => `<li class="badge badge--tag">${t}</li>`).join("")}</ul>
          <ul class="compat">
            <li class="${pet.apartamento ? "sim" : "nao"}">${pet.apartamento ? "✓" : "✕"} Vive bem em apartamento</li>
            <li class="${pet.criancas ? "sim" : "nao"}">${pet.criancas ? "✓" : "✕"} Convive com crianças</li>
          </ul>
          <div class="perfil__acoes">
            ${pedido
              ? `<p class="alerta alerta--sucesso" role="status"><span class="alerta__icone">✓</span><span class="alerta__texto"><strong>Pedido enviado</strong><span>Entraremos em contato por ${escaparHTML(pedido.telefone)}.</span></span></p>`
              : `<button class="btn btn--destaque" data-pedir-adocao>🏠 Quero adotar ${pet.nome}</button>`}
            <button class="btn btn--contorno btn-match-texto ${ativo ? "btn-match--ativo" : ""}" data-match="${pet.id}" aria-pressed="${ativo}">❤ Match</button>
          </div>
        </div>
      </div>
    </section>
    ${outros.length ? `
    <section class="secao container">
      <h2 class="secao__titulo-sm">Você também pode gostar</h2>
      <div class="grade-pets grade-pets--3">${outros.map(cardPet).join("")}</div>
    </section>` : ""}`;
  },
  init(app, params) {
    const pet = buscarPet(params.id);
    const botao = pet && $("[data-pedir-adocao]", app);
    if (!botao) return;
    botao.addEventListener("click", () => abrirModal({
      titulo: `Adotar ${pet.nome} 🏠`,
      conteudo: `
        <form class="form" novalidate>
          <p class="texto-suave">Preencha seus dados. Nossa equipe fará uma entrevista rápida antes da adoção.</p>
          <div class="form__grupo">
            <label class="form__rotulo" for="ad-nome">Nome completo *</label>
            <input class="form__campo" id="ad-nome" data-regras="obrigatorio nome" autocomplete="name">
            <p class="form__erro" aria-live="polite"></p>
          </div>
          <div class="form__grupo">
            <label class="form__rotulo" for="ad-tel">Telefone / WhatsApp *</label>
            <input class="form__campo" id="ad-tel" data-mascara="telefone" data-regras="obrigatorio telefone" inputmode="numeric" placeholder="(41) 99999-9999">
            <p class="form__erro" aria-live="polite"></p>
          </div>
          <div class="modal__acoes">
            <button type="button" class="btn btn--contorno" data-fechar-modal>Cancelar</button>
            <button type="submit" class="btn btn--destaque">Enviar pedido</button>
          </div>
        </form>`,
      aoAbrir(corpo) {
        aplicarMascaras(corpo);
        const form = $("form", corpo);
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          let ok = true;
          $$("[data-regras]", form).forEach((campo) => {
            const erro = validarCampo(campo);
            const grupo = campo.closest(".form__grupo");
            grupo.classList.toggle("form__grupo--erro", !!erro);
            grupo.querySelector(".form__erro").textContent = erro;
            if (erro && ok) { campo.focus(); ok = false; }
          });
          if (!ok) return;
          const pedidos = ler(CHAVES.PEDIDOS_ADOCAO, []);
          pedidos.push({ petId: pet.id, nome: $("#ad-nome", form).value.trim(), telefone: $("#ad-tel", form).value, data: new Date().toISOString() });
          salvar(CHAVES.PEDIDOS_ADOCAO, pedidos);
          fecharModal();
          celebrarGrande();
          toast("Pedido de adoção enviado! 🎉", `Vamos falar com você sobre o(a) ${pet.nome}.`, "sucesso", 5000);
          window.dispatchEvent(new HashChangeEvent("hashchange")); /* re-renderiza a página */
        });
      }
    }));
  }
};
