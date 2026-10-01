/* Página: Projetos e doações */
import { PROJETOS } from "../dados/projetos.js";
import { cardProjeto } from "../componentes/templates.js";
import { listarDoacoes, atualizarBarras, totais } from "../componentes/doacoes.js";
import { aoMudar, salvar, avisar, CHAVES } from "../utils/storage.js";
import { moeda, $ } from "../utils/dom.js";

export default {
  titulo: "Projetos",
  render() {
    const t = totais();
    return `
    <section class="pagina-topo container">
      <span class="sobretitulo">Transparência</span>
      <h1>Nossos projetos</h1>
      <p class="texto-suave">Veja para onde vai cada real doado e acompanhe as metas em tempo real.</p>
    </section>
    <section class="container">
      <div class="progresso progresso--grande progresso--cartao revelar" data-meta-geral>
        <div class="progresso__info"><span>Meta geral: <strong data-valor>${moeda(t.total)}</strong> de ${moeda(t.meta)}</span><strong data-pct>${t.porcentagem}%</strong></div>
        <div class="progresso__trilho"><div class="progresso__barra" data-progresso="${t.porcentagem}"></div></div>
      </div>
      <h2 class="visualmente-oculto">Lista de projetos</h2>
      <div class="grade-projetos">${PROJETOS.map(cardProjeto).join("")}</div>
    </section>
    <section class="secao container" aria-labelledby="titulo-historico">
      <div class="historico revelar">
        <div class="historico__topo">
          <h2 id="titulo-historico">Suas doações</h2>
          <button class="btn btn--contorno btn--sm" data-limpar-doacoes hidden>Limpar histórico</button>
        </div>
        <ul class="historico__lista" data-historico></ul>
      </div>
    </section>`;
  },
  init(app) {
    const renderHistorico = () => {
      const lista = listarDoacoes();
      const nomes = Object.fromEntries(PROJETOS.map((p) => [p.id, `${p.icone} ${p.titulo}`]));
      $("[data-historico]", app).innerHTML = lista.length
        ? lista.map((d) => `<li><span>${nomes[d.projeto]}</span><span class="texto-suave texto-sm">${new Date(d.data).toLocaleDateString("pt-BR")}</span><strong>${moeda(d.valor)}</strong></li>`).join("")
        : `<li class="historico__vazio">Você ainda não fez nenhuma doação. Que tal começar agora? 💛</li>`;
      $("[data-limpar-doacoes]", app).hidden = lista.length === 0;
      atualizarBarras(app);
    };
    $("[data-limpar-doacoes]", app).addEventListener("click", () => { salvar(CHAVES.DOACOES, []); avisar(CHAVES.DOACOES, []); });
    renderHistorico();
    return aoMudar(CHAVES.DOACOES, renderHistorico);
  }
};
