/* =========================================================
   Templates reutilizáveis (funções que devolvem HTML)
   ========================================================= */
import { ROTULOS } from "../dados/pets.js";
import { moeda } from "../utils/dom.js";
import { temMatch } from "./matches.js";
import { arrecadado } from "./doacoes.js";

export function cardPet(pet) {
  const ativo = temMatch(pet.id);
  return `
  <article class="card-pet revelar" data-especie="${pet.especie}" data-porte="${pet.porte}" data-idade="${pet.idade}">
    <a class="card-pet__midia" href="#/pet/${pet.id}" aria-label="Ver perfil de ${pet.nome}">
      <img src="${pet.img}" alt="Ilustração de ${pet.nome}, ${ROTULOS.especie[pet.especie].toLowerCase()} ${pet.sexo.toLowerCase()}" loading="lazy" width="400" height="400">
      <span class="badge badge--${pet.especie}">${pet.especie === "cao" ? "🐶" : "🐱"} ${ROTULOS.especie[pet.especie]}</span>
    </a>
    <button class="btn-match ${ativo ? "btn-match--ativo" : ""}" data-match="${pet.id}" aria-pressed="${ativo}" aria-label="Dar match com ${pet.nome}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.2 5 6.6 5c2 0 3.5 1.1 4.4 2.6h2C13.9 6.1 15.4 5 17.4 5c3.4 0 5.4 3.6 4.1 6.8C19.5 16.4 12 21 12 21z"/></svg>
    </button>
    <div class="card-pet__corpo">
      <div class="card-pet__topo">
        <h3>${pet.nome}</h3>
        <span class="texto-sm texto-suave">${pet.sexo} · ${pet.idadeTexto}</span>
      </div>
      <p class="texto-suave">${pet.resumo}</p>
      <ul class="tags">${pet.tags.slice(0, 3).map((t) => `<li class="badge badge--tag">${t}</li>`).join("")}</ul>
      <a class="btn btn--primario btn--sm card-pet__acao" href="#/pet/${pet.id}">Conhecer ${pet.nome}</a>
    </div>
  </article>`;
}

export function barraProjeto(p) {
  const valor = arrecadado(p.id);
  const pct = Math.min(100, Math.round((valor / p.meta) * 100));
  return `
  <div class="progresso" data-barra-projeto="${p.id}">
    <div class="progresso__info">
      <span><strong data-valor>${moeda(valor)}</strong> de ${moeda(p.meta)}</span>
      <strong data-pct>${pct}%</strong>
    </div>
    <div class="progresso__trilho" role="progressbar" aria-label="Arrecadação de ${p.titulo}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
      <div class="progresso__barra" data-progresso="${pct}"></div>
    </div>
  </div>`;
}

export function cardProjeto(p) {
  return `
  <article class="card-projeto revelar">
    <div class="card-projeto__icone" aria-hidden="true">${p.icone}</div>
    <span class="badge badge--tag">${p.categoria}</span>
    <h3>${p.titulo}</h3>
    <p class="texto-suave">${p.descricao}</p>
    ${barraProjeto(p)}
    <button class="btn btn--destaque btn--sm" data-doar="${p.id}">Apoiar este projeto</button>
  </article>`;
}

export const secaoTopo = (sobretitulo, titulo, texto = "", centro = false) => `
  <div class="secao__topo ${centro ? "secao__topo--centro" : ""} revelar">
    <span class="sobretitulo">${sobretitulo}</span>
    <h2>${titulo}</h2>
    ${texto ? `<p class="texto-suave">${texto}</p>` : ""}
  </div>`;
