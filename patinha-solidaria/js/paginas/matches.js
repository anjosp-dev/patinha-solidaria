/* Página: Meus matches (lidos do localStorage) */
import { PETS } from "../dados/pets.js";
import { listarMatches } from "../componentes/matches.js";
import { cardPet } from "../componentes/templates.js";
import { observarRevelacoes } from "../componentes/efeitos.js";
import { ler, salvar, aoMudar, avisar, CHAVES } from "../utils/storage.js";
import { $ } from "../utils/dom.js";

export default {
  titulo: "Meus matches",
  render() {
    return `
    <section class="pagina-topo container">
      <span class="sobretitulo">Salvos neste navegador</span>
      <h1>Meus matches 💛</h1>
      <p class="texto-suave">Os pets que você escolheu ficam guardados aqui, mesmo se você fechar a página.</p>
    </section>
    <section class="container">
      <div class="grade-pets" data-lista></div>
      <div class="vazio" data-vazio hidden><span>💔</span><p>Você ainda não deu match com nenhum pet.</p><a class="btn btn--primario" href="#/adotar">Começar a dar match</a></div>
      <p class="centro" data-limpar-area hidden><button class="btn btn--contorno btn--sm" data-limpar-matches>Limpar todos os matches</button></p>
    </section>`;
  },
  init(app) {
    const render = () => {
      const ids = listarMatches();
      const pets = PETS.filter((p) => ids.includes(p.id));
      $("[data-lista]", app).innerHTML = pets.map(cardPet).join("");
      $("[data-vazio]", app).hidden = pets.length > 0;
      $("[data-limpar-area]", app).hidden = pets.length === 0;
      observarRevelacoes(app);
    };
    $("[data-limpar-matches]", app).addEventListener("click", () => {
      salvar(CHAVES.MATCHES, []);
      avisar(CHAVES.MATCHES, []);
    });
    render();
    return aoMudar(CHAVES.MATCHES, render);
  }
};
