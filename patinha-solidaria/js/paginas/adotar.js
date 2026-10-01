/* Página: Adotar (modo match com arrastar + lista filtrável) */
import { PETS } from "../dados/pets.js";
import { cardPet } from "../componentes/templates.js";
import { alternarMatch, listarMatches } from "../componentes/matches.js";
import { observarRevelacoes } from "../componentes/efeitos.js";
import { $, $$ } from "../utils/dom.js";

export default {
  titulo: "Adotar",
  render(params) {
    return `
    <section class="pagina-topo container">
      <span class="sobretitulo">Adoção responsável</span>
      <h1>Encontre seu novo melhor amigo</h1>
      <p class="texto-suave">Arraste o card para a direita para dar match 💛 ou para a esquerda para ver o próximo.</p>
    </section>

    <section class="container match" aria-labelledby="titulo-match">
      <h2 id="titulo-match" class="visualmente-oculto">Modo match</h2>
      <div class="match__pilha" aria-live="polite"></div>
      <div class="match__controles">
        <button class="match__botao match__botao--nao" data-acao="passar" aria-label="Passar para o próximo pet">✕</button>
        <button class="match__botao match__botao--desfazer" data-acao="desfazer" aria-label="Voltar ao pet anterior">↺</button>
        <button class="match__botao match__botao--sim" data-acao="match" aria-label="Dar match">❤</button>
      </div>
      <p class="texto-sm texto-suave centro">Dica: no teclado, use as setas ← e →.</p>
    </section>

    <section class="secao container" aria-labelledby="titulo-todos">
      <div class="filtro-barra">
        <h2 id="titulo-todos">Todos os pets</h2>
        <div class="filtros" role="group" aria-label="Filtrar pets">
          <label class="visualmente-oculto" for="f-especie">Espécie</label>
          <select id="f-especie" class="form__campo form__campo--sm" data-filtro="especie">
            <option value="">Todas as espécies</option><option value="cao">Cachorros</option><option value="gato">Gatos</option>
          </select>
          <label class="visualmente-oculto" for="f-porte">Porte</label>
          <select id="f-porte" class="form__campo form__campo--sm" data-filtro="porte">
            <option value="">Todos os portes</option><option value="pequeno">Pequeno</option><option value="medio">Médio</option><option value="grande">Grande</option>
          </select>
          <label class="visualmente-oculto" for="f-idade">Idade</label>
          <select id="f-idade" class="form__campo form__campo--sm" data-filtro="idade">
            <option value="">Todas as idades</option><option value="filhote">Filhote</option><option value="adulto">Adulto</option><option value="idoso">Idoso</option>
          </select>
          <label class="visualmente-oculto" for="f-busca">Buscar por nome</label>
          <input id="f-busca" class="form__campo form__campo--sm" type="search" placeholder="Buscar por nome...">
        </div>
      </div>
      <p class="texto-sm texto-suave" data-contagem aria-live="polite"></p>
      <div class="grade-pets" data-lista></div>
      <div class="vazio" data-vazio hidden><span>🐾</span><p>Nenhum pet encontrado com esses filtros.</p><button class="btn btn--contorno btn--sm" data-limpar>Limpar filtros</button></div>
    </section>`;
  },

  init(app, params) {
    /* ---------- Lista com filtros ---------- */
    const estado = { especie: params.especie || "", porte: "", idade: "", busca: "" };
    if (estado.especie) $("#f-especie", app).value = estado.especie;
    const lista = $("[data-lista]", app);

    const renderLista = () => {
      const filtrados = PETS.filter((p) =>
        (!estado.especie || p.especie === estado.especie) &&
        (!estado.porte || p.porte === estado.porte) &&
        (!estado.idade || p.idade === estado.idade) &&
        p.nome.toLowerCase().includes(estado.busca));
      lista.innerHTML = filtrados.map(cardPet).join("");
      $("[data-vazio]", app).hidden = filtrados.length > 0;
      $("[data-contagem]", app).textContent = `${filtrados.length} ${filtrados.length === 1 ? "pet encontrado" : "pets encontrados"}`;
      observarRevelacoes(lista);
    };
    $$("[data-filtro]", app).forEach((sel) => sel.addEventListener("change", () => { estado[sel.dataset.filtro] = sel.value; renderLista(); }));
    $("#f-busca", app).addEventListener("input", (e) => { estado.busca = e.target.value.trim().toLowerCase(); renderLista(); });
    $("[data-limpar]", app).addEventListener("click", () => {
      Object.assign(estado, { especie: "", porte: "", idade: "", busca: "" });
      $$("[data-filtro]", app).forEach((s) => (s.value = ""));
      $("#f-busca", app).value = "";
      renderLista();
    });
    renderLista();

    /* ---------- Modo match (arrastar) ---------- */
    const pilha = $(".match__pilha", app);
    const fila = PETS.filter((p) => !listarMatches().includes(p.id) && (!estado.especie || p.especie === estado.especie));
    let indice = 0;

    const cardMatch = (p) => `
      <article class="match-card" data-id="${p.id}" tabindex="0" aria-label="${p.nome}, ${p.idadeTexto}. ${p.resumo}">
        <img src="${p.img}" alt="" draggable="false">
        <span class="match-card__selo match-card__selo--sim">MATCH</span>
        <span class="match-card__selo match-card__selo--nao">PRÓXIMO</span>
        <div class="match-card__info">
          <h3>${p.nome} <small>${p.idadeTexto}</small></h3>
          <p>${p.resumo}</p>
          <ul class="tags">${p.tags.slice(0, 3).map((t) => `<li class="badge badge--vidro">${t}</li>`).join("")}</ul>
        </div>
      </article>`;

    const renderPilha = () => {
      const restantes = fila.slice(indice, indice + 3);
      if (!restantes.length) {
        pilha.innerHTML = `<div class="match__fim"><span>🎉</span><h3>Você viu todos os pets!</h3><p>Confira quem você escolheu na sua lista.</p><a class="btn btn--primario" href="#/matches">Ver meus matches</a></div>`;
        return;
      }
      pilha.innerHTML = restantes.map(cardMatch).reverse().join("");
      /* Só o card do topo recebe foco e é lido pelo leitor de tela */
      $$(".match-card", pilha).forEach((c, i, todos) => {
        const topo = i === todos.length - 1;
        c.tabIndex = topo ? 0 : -1;
        if (!topo) c.setAttribute("aria-hidden", "true");
      });
      ativarArraste(pilha.lastElementChild);
    };

    const decidir = (sim) => {
      const card = pilha.querySelector(".match-card:last-child");
      if (!card) return;
      card.classList.add(sim ? "match-card--sim" : "match-card--nao");
      if (sim) alternarMatch(card.dataset.id, true);
      indice++;
      setTimeout(renderPilha, 350);
    };

    function ativarArraste(card) {
      let inicioX = 0, deltaX = 0, arrastando = false;
      card.addEventListener("pointerdown", (e) => {
        arrastando = true; inicioX = e.clientX; card.setPointerCapture(e.pointerId);
        card.style.transition = "none";
      });
      card.addEventListener("pointermove", (e) => {
        if (!arrastando) return;
        deltaX = e.clientX - inicioX;
        card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 15}deg)`;
        card.style.setProperty("--forca-sim", Math.max(0, Math.min(1, deltaX / 120)));
        card.style.setProperty("--forca-nao", Math.max(0, Math.min(1, -deltaX / 120)));
      });
      const soltar = () => {
        if (!arrastando) return;
        arrastando = false;
        card.style.transition = "";
        if (Math.abs(deltaX) > 110) { decidir(deltaX > 0); }
        else { card.style.transform = ""; card.style.setProperty("--forca-sim", 0); card.style.setProperty("--forca-nao", 0); }
        deltaX = 0;
      };
      card.addEventListener("pointerup", soltar);
      card.addEventListener("pointercancel", soltar);
      card.addEventListener("dblclick", () => { location.hash = `#/pet/${card.dataset.id}`; });
    }

    $$("[data-acao]", app).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.acao === "match") decidir(true);
      if (b.dataset.acao === "passar") decidir(false);
      if (b.dataset.acao === "desfazer" && indice > 0) { indice--; renderPilha(); }
    }));
    const teclas = (e) => {
      if (!document.body.contains(pilha)) return document.removeEventListener("keydown", teclas);
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight") decidir(true);
      if (e.key === "ArrowLeft") decidir(false);
    };
    document.addEventListener("keydown", teclas);
    renderPilha();
  }
};
