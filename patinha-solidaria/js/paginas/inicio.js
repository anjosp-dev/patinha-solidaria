/* Página: Início */
import { PETS } from "../dados/pets.js";
import { PROJETOS } from "../dados/projetos.js";
import { cardPet, secaoTopo } from "../componentes/templates.js";
import { totais, atualizarBarras } from "../componentes/doacoes.js";
import { rastroDePatinhas } from "../componentes/efeitos.js";
import { aoMudar, CHAVES } from "../utils/storage.js";
import { moeda, $ } from "../utils/dom.js";

export default {
  titulo: "Início",
  render() {
    const t = totais();
    return `
    <section class="hero" aria-labelledby="titulo-hero">
      <div class="hero__fundo" aria-hidden="true"><span class="bolha bolha--1"></span><span class="bolha bolha--2"></span><span class="bolha bolha--3"></span></div>
      <div class="container hero__grid">
        <div class="hero__conteudo">
          <span class="hero__selo">🐾 ONG de proteção animal · 100% online</span>
          <h1 id="titulo-hero">Todo pet merece <span class="destaque-texto">uma segunda chance</span>.</h1>
          <p>Resgatamos animais vítimas de maus-tratos e abandono, cuidamos de cada um e encontramos lares cheios de amor. Você pode fazer parte dessa história.</p>
          <div class="hero__botoes">
            <a href="#/adotar" class="btn btn--destaque">💛 Quero adotar</a>
            <button class="btn btn--claro" data-doar>Fazer uma doação</button>
          </div>
        </div>
        <div class="hero__pilha" aria-hidden="true">
          ${PETS.slice(0, 3).map((p, i) => `<figure class="hero__pet hero__pet--${i + 1}"><img src="${p.img}" alt=""><figcaption>${p.nome}</figcaption></figure>`).join("")}
        </div>
      </div>
    </section>

    <section class="container numeros" aria-label="Nossos números">
      <div class="numero revelar"><strong data-contador="${PETS.length * 18}" data-sufixo="+">0</strong><span>animais resgatados</span></div>
      <div class="numero revelar"><strong data-contador="${PETS.length * 11}">0</strong><span>adoções felizes</span></div>
      <div class="numero revelar"><strong data-contador="64">0</strong><span>voluntários ativos</span></div>
      <div class="numero revelar"><strong data-contador="${PROJETOS.length}">0</strong><span>projetos em andamento</span></div>
    </section>

    <section class="secao container" aria-labelledby="titulo-ajudar">
      ${secaoTopo("Como ajudar", "Três jeitos de mudar uma vida", "Escolha o caminho que mais combina com você. Todos fazem diferença.", true).replace("<h2>", '<h2 id="titulo-ajudar">')}
      <div class="ajuda">
        <a class="ajuda__card revelar" href="#/adotar"><span class="ajuda__icone">🏠</span><h3>Adote</h3><p>Dê match com um pet e comece uma nova história juntos.</p><span class="ajuda__link">Ver pets →</span></a>
        <button class="ajuda__card ajuda__card--destaque revelar" data-doar><span class="ajuda__icone">💛</span><h3>Doe</h3><p>Qualquer valor vira ração, vacina e tratamento.</p><span class="ajuda__link">Doar agora →</span></button>
        <a class="ajuda__card revelar" href="#/voluntario"><span class="ajuda__icone">🤝</span><h3>Seja voluntário</h3><p>Ajude em passeios, lar temporário ou divulgação.</p><span class="ajuda__link">Quero ajudar →</span></a>
      </div>
    </section>

    <section class="secao secao--escura" aria-labelledby="titulo-meta">
      <div class="container meta revelar">
        <div>
          <span class="sobretitulo sobretitulo--claro">Meta coletiva de 2026</span>
          <h2 id="titulo-meta">Juntos já arrecadamos <span data-meta-texto>${moeda(t.total)}</span></h2>
          <p>Cada doação atualiza esta barra em tempo real. Faça um teste e veja a meta subir!</p>
        </div>
        <div class="progresso progresso--grande" data-meta-geral>
          <div class="progresso__info"><span><strong data-valor>${moeda(t.total)}</strong> de ${moeda(t.meta)}</span><strong data-pct>${t.porcentagem}%</strong></div>
          <div class="progresso__trilho"><div class="progresso__barra" data-progresso="${t.porcentagem}"></div></div>
        </div>
        <button class="btn btn--destaque" data-doar>Contribuir com a meta</button>
      </div>
    </section>

    <section class="secao container" aria-labelledby="titulo-pets">
      ${secaoTopo("Esperando por você", "Pets em destaque").replace("<h2>", '<h2 id="titulo-pets">')}
      <div class="grade-pets">${PETS.slice(0, 4).map(cardPet).join("")}</div>
      <p class="centro"><a href="#/adotar" class="btn btn--contorno">Ver todos os pets</a></p>
    </section>

    <section class="container" aria-labelledby="titulo-quiz">
      <div class="cta-quiz revelar">
        <div>
          <h2 id="titulo-quiz">Não sabe qual pet combina com você?</h2>
          <p>Responda 5 perguntas rápidas e descubra seu match ideal.</p>
        </div>
        <a class="btn btn--primario" href="#/quiz">Fazer o quiz ✨</a>
      </div>
    </section>`;
  },
  init(app) {
    rastroDePatinhas($(".hero", app));
    const atualizar = () => {
      atualizarBarras(app);
      const t = totais();
      const el = $("[data-meta-texto]", app);
      if (el) el.textContent = moeda(t.total);
    };
    /* devolve a limpeza: o router chama ao sair da página */
    return aoMudar(CHAVES.DOACOES, atualizar);
  }
};
