/* Página: Quiz "Qual pet combina com você?" */
import { PETS } from "../dados/pets.js";
import { ler, salvar, CHAVES } from "../utils/storage.js";
import { alternarMatch, temMatch } from "../componentes/matches.js";
import { $, $$ } from "../utils/dom.js";
import { celebrar } from "../utils/celebrar.js";

const PERGUNTAS = [
  { id: "casa", texto: "Onde você mora?", opcoes: [["apto", "🏢 Apartamento"], ["casa", "🏡 Casa com quintal"]] },
  { id: "tempo", texto: "Quanto tempo livre você tem por dia?", opcoes: [["1", "⏱️ Pouco, menos de 1h"], ["2", "🕑 Umas 2 horas"], ["3", "🌞 Bastante tempo"]] },
  { id: "energia", texto: "Qual o seu ritmo?", opcoes: [["1", "🛋️ Sofá e série"], ["2", "🚶 Equilibrado"], ["3", "🏃 Muito ativo"]] },
  { id: "criancas", texto: "Tem crianças em casa?", opcoes: [["sim", "👧 Sim"], ["nao", "🙅 Não"]] },
  { id: "especie", texto: "Você prefere...", opcoes: [["cao", "🐶 Cachorro"], ["gato", "🐱 Gato"], ["tanto", "💛 Tanto faz"]] }
];

/* Pontua cada pet de acordo com as respostas */
function calcularMatch(r) {
  const ritmo = Math.round((Number(r.tempo) + Number(r.energia)) / 2);
  return PETS.map((p) => {
    let pontos = 0;
    if (r.especie === "tanto" || r.especie === p.especie) pontos += 3; else pontos -= 5;
    if (r.casa === "casa" || p.apartamento) pontos += 2; else pontos -= 2;
    if (r.criancas === "nao" || p.criancas) pontos += 2; else pontos -= 3;
    pontos += 3 - Math.abs(p.energia - ritmo) * 1.5;
    return { pet: p, pontos };
  }).sort((a, b) => b.pontos - a.pontos);
}

export default {
  titulo: "Quiz",
  render() {
    return `
    <section class="container quiz">
      <div class="quiz__caixa">
        <div class="quiz__progresso" aria-hidden="true"><span></span></div>
        <div class="quiz__conteudo" aria-live="polite"></div>
      </div>
    </section>`;
  },
  init(app) {
    const conteudo = $(".quiz__conteudo", app);
    const barra = $(".quiz__progresso span", app);
    const respostas = {};
    let passo = 0;

    const mostrarPergunta = () => {
      const q = PERGUNTAS[passo];
      barra.style.width = (passo / PERGUNTAS.length) * 100 + "%";
      conteudo.innerHTML = `
        <p class="sobretitulo">Pergunta ${passo + 1} de ${PERGUNTAS.length}</p>
        <h1 class="quiz__pergunta">${q.texto}</h1>
        <div class="quiz__opcoes">
          ${q.opcoes.map(([valor, rotulo]) => `<button class="quiz__opcao" data-valor="${valor}">${rotulo}</button>`).join("")}
        </div>
        ${passo > 0 ? `<button class="link-voltar" data-voltar>← Voltar</button>` : ""}`;
      $$(".quiz__opcao", conteudo).forEach((b) => b.addEventListener("click", () => {
        respostas[q.id] = b.dataset.valor;
        b.classList.add("quiz__opcao--escolhida");
        setTimeout(() => { passo++; passo < PERGUNTAS.length ? mostrarPergunta() : mostrarResultado(); }, 250);
      }));
      $("[data-voltar]", conteudo)?.addEventListener("click", () => { passo--; mostrarPergunta(); });
      $(".quiz__opcao", conteudo).focus();
    };

    const mostrarResultado = () => {
      barra.style.width = "100%";
      const ranking = calcularMatch(respostas);
      const [melhor, ...resto] = ranking;
      const pet = melhor.pet;
      salvar(CHAVES.RESULTADO_QUIZ, { petId: pet.id, respostas, data: new Date().toISOString() });
      conteudo.innerHTML = `
        <div class="quiz__resultado">
          <p class="sobretitulo">Seu match ideal é...</p>
          <img class="quiz__foto" src="${pet.img}" alt="Ilustração de ${pet.nome}" width="220" height="220">
          <h1>${pet.nome}! 🎉</h1>
          <p class="texto-suave">${pet.resumo}</p>
          <div class="quiz__acoes">
            <a class="btn btn--primario" href="#/pet/${pet.id}">Conhecer ${pet.nome}</a>
            <button class="btn btn--destaque" data-salvar>${temMatch(pet.id) ? "✓ Já está nos matches" : "❤ Salvar match"}</button>
          </div>
          <p class="texto-sm texto-suave">Também combinam com você: ${resto.slice(0, 2).map((r) => `<a href="#/pet/${r.pet.id}">${r.pet.nome}</a>`).join(" e ")}</p>
          <button class="link-voltar" data-refazer>↻ Refazer o quiz</button>
        </div>`;
      celebrar($(".quiz__foto", conteudo));
      $("[data-salvar]", conteudo).addEventListener("click", (e) => { alternarMatch(pet.id, true); e.target.textContent = "✓ Já está nos matches"; });
      $("[data-refazer]", conteudo).addEventListener("click", () => { passo = 0; mostrarPergunta(); });
    };

    const anterior = ler(CHAVES.RESULTADO_QUIZ);
    if (anterior) {
      const pet = PETS.find((p) => p.id === anterior.petId);
      conteudo.innerHTML = `
        <div class="quiz__resultado">
          <p class="sobretitulo">Bem-vindo de volta!</p>
          <img class="quiz__foto" src="${pet.img}" alt="" width="160" height="160">
          <h1>Da última vez, seu match foi ${pet.nome}</h1>
          <div class="quiz__acoes">
            <a class="btn btn--contorno" href="#/pet/${pet.id}">Ver ${pet.nome}</a>
            <button class="btn btn--primario" data-novo>Fazer de novo</button>
          </div>
        </div>`;
      $("[data-novo]", conteudo).addEventListener("click", mostrarPergunta);
    } else {
      mostrarPergunta();
    }
  }
};
