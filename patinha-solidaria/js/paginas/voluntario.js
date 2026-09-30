/* Página: Cadastro de voluntário
   Validação em tempo real, máscaras, busca de CEP (ViaCEP)
   e rascunho salvo automaticamente no localStorage. */
import { aplicarMascaras } from "../utils/mascaras.js";
import { validarCampo } from "../utils/validadores.js";
import { ler, salvar, remover, CHAVES } from "../utils/storage.js";
import { alertaHTML } from "../componentes/alerta.js";
import { toast } from "../componentes/toast.js";
import { celebrarGrande } from "../utils/celebrar.js";
import { $, $$, escaparHTML } from "../utils/dom.js";

const campo = (id, rotulo, atributos, meia = true, ajuda = "") => `
  <div class="form__grupo ${meia ? "form__grupo--metade" : ""}">
    <label class="form__rotulo" for="${id}">${rotulo}</label>
    <input class="form__campo" id="${id}" name="${id}" ${atributos}>
    ${ajuda ? `<span class="form__ajuda">${ajuda}</span>` : ""}
    <p class="form__erro" id="${id}-erro" aria-live="polite"></p>
  </div>`;

export default {
  titulo: "Seja voluntário",
  render() {
    return `
    <section class="pagina-topo container">
      <span class="sobretitulo">Faça parte</span>
      <h1>Seja voluntário 🤝</h1>
      <p class="texto-suave">Leva menos de 2 minutos. Seu progresso é salvo automaticamente, pode fechar e voltar depois.</p>
    </section>
    <section class="container voluntario">
      <form class="form" id="form-voluntario" novalidate>
        <div class="form__alertas"></div>
        <p class="rascunho-aviso texto-sm" data-rascunho hidden>💾 Rascunho salvo automaticamente</p>

        <fieldset class="form__bloco">
          <legend>Dados pessoais</legend>
          ${campo("nome", "Nome completo *", 'data-regras="obrigatorio nome" autocomplete="name" placeholder="Maria da Silva"', false)}
          ${campo("email", "E-mail *", 'type="email" data-regras="obrigatorio email" autocomplete="email" placeholder="maria@email.com"')}
          ${campo("telefone", "Telefone *", 'data-mascara="telefone" data-regras="obrigatorio telefone" inputmode="numeric" autocomplete="tel" placeholder="(41) 99999-9999"')}
          ${campo("cpf", "CPF *", 'data-mascara="cpf" data-regras="obrigatorio cpf" inputmode="numeric" placeholder="000.000.000-00"')}
          ${campo("nascimento", "Data de nascimento *", 'type="date" data-regras="obrigatorio maiorIdade"', true, "Precisa ter 18 anos ou mais.")}
        </fieldset>

        <fieldset class="form__bloco">
          <legend>Endereço</legend>
          ${campo("cep", "CEP *", 'data-mascara="cep" data-regras="obrigatorio cep" inputmode="numeric" autocomplete="postal-code" placeholder="80000-000"', true, "O endereço é preenchido automaticamente.")}
          ${campo("numero", "Número *", 'data-regras="obrigatorio" placeholder="123"')}
          ${campo("rua", "Rua *", 'data-regras="obrigatorio" autocomplete="address-line1"', false)}
          ${campo("cidade", "Cidade *", 'data-regras="obrigatorio" autocomplete="address-level2"')}
          ${campo("uf", "Estado (UF) *", 'data-regras="obrigatorio" maxlength="2" autocomplete="address-level1"')}
        </fieldset>

        <fieldset class="form__bloco">
          <legend>Como você quer ajudar?</legend>
          <div class="chips" role="group" aria-label="Áreas de interesse">
            ${["Passeios", "Lar temporário", "Eventos de adoção", "Divulgação", "Transporte", "Fotografia"].map((a) => `
              <label class="chip"><input type="checkbox" name="areas" value="${a}"><span>${a}</span></label>`).join("")}
          </div>
          <p class="form__erro" id="areas-erro" aria-live="polite"></p>
          <div class="form__grupo">
            <label class="form__rotulo" for="disponibilidade">Disponibilidade *</label>
            <select class="form__campo" id="disponibilidade" name="disponibilidade" data-regras="obrigatorio">
              <option value="">Selecione...</option><option>Dias de semana</option><option>Finais de semana</option><option>Qualquer dia</option>
            </select>
            <p class="form__erro" aria-live="polite"></p>
          </div>
          <div class="form__grupo">
            <label class="form__rotulo" for="mensagem">Conte um pouco sobre você *</label>
            <textarea class="form__campo" id="mensagem" name="mensagem" rows="4" maxlength="300" data-regras="obrigatorio minimo10" placeholder="Por que você quer ser voluntário?"></textarea>
            <span class="form__contador texto-sm" aria-live="polite">0/300</span>
            <p class="form__erro" aria-live="polite"></p>
          </div>
        </fieldset>

        <div class="form__grupo">
          <label class="form__check"><input type="checkbox" id="termos" name="termos" data-regras="marcado"> Li e aceito o <button type="button" class="link-inline" data-carregar-html="html/termo-voluntariado.html" data-titulo="Termo de voluntariado">termo de voluntariado</button> da Patinha Solidária.</label>
          <p class="form__erro" aria-live="polite"></p>
        </div>

        <div class="form__acoes">
          <button class="btn btn--contorno" type="button" data-limpar-form>Limpar</button>
          <button class="btn btn--destaque" type="submit">Enviar cadastro</button>
        </div>
      </form>

      <aside class="cadastros revelar" aria-labelledby="titulo-cadastros">
        <h2 id="titulo-cadastros">Cadastros feitos neste navegador</h2>
        <ul data-cadastros></ul>
      </aside>
    </section>`;
  },

  init(app) {
    const form = $("#form-voluntario", app);
    aplicarMascaras(form);

    /* ---------- Mostrar erro/sucesso em um campo ---------- */
    const marcar = (el) => {
      const erro = validarCampo(el);
      const grupo = el.closest(".form__grupo");
      grupo.classList.toggle("form__grupo--erro", !!erro);
      grupo.classList.toggle("form__grupo--sucesso", !erro && el.type !== "checkbox");
      grupo.querySelector(".form__erro").textContent = erro;
      el.setAttribute("aria-invalid", String(!!erro));
      return !erro;
    };
    const campos = $$("[data-regras]", form);
    campos.forEach((el) => {
      el.addEventListener("blur", () => { if (el.value || el.dataset.tocado) marcar(el); el.dataset.tocado = "1"; });
      el.addEventListener("input", () => { if (el.closest(".form__grupo--erro, .form__grupo--sucesso")) marcar(el); });
      el.addEventListener("change", () => { if (el.type === "checkbox" || el.tagName === "SELECT") marcar(el); });
    });

    /* ---------- Contador da mensagem ---------- */
    const msg = $("#mensagem", form);
    const contador = $(".form__contador", form);
    const atualizarContador = () => (contador.textContent = `${msg.value.length}/300`);
    msg.addEventListener("input", atualizarContador);

    /* ---------- Busca de endereço pelo CEP (API ViaCEP) ---------- */
    const cep = $("#cep", form);
    cep.addEventListener("input", async () => {
      const numeros = cep.value.replace(/\D/g, "");
      if (numeros.length !== 8) return;
      cep.closest(".form__grupo").classList.add("form__grupo--carregando");
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
        const dados = await resposta.json();
        if (dados.erro) throw new Error("CEP não encontrado");
        $("#rua", form).value = `${dados.logradouro}${dados.bairro ? " - " + dados.bairro : ""}`;
        $("#cidade", form).value = dados.localidade;
        $("#uf", form).value = dados.uf;
        ["#rua", "#cidade", "#uf", "#cep"].forEach((s) => marcar($(s, form)));
        $("#numero", form).focus();
        salvarRascunho();
      } catch (erro) {
        const grupo = cep.closest(".form__grupo");
        grupo.classList.add("form__grupo--erro");
        grupo.querySelector(".form__erro").textContent = "Não encontramos esse CEP. Preencha o endereço manualmente.";
      } finally {
        cep.closest(".form__grupo").classList.remove("form__grupo--carregando");
      }
    });

    /* ---------- Rascunho automático (localStorage) ---------- */
    const aviso = $("[data-rascunho]", form);
    const dadosDoForm = () => {
      const d = Object.fromEntries(new FormData(form));
      d.areas = $$('input[name="areas"]:checked', form).map((c) => c.value);
      d.termos = $("#termos", form).checked;
      return d;
    };
    let temporizador;
    const gravarAgora = () => {
      clearTimeout(temporizador);
      const d = dadosDoForm();
      delete d.cpf; /* dado sensível não fica no rascunho */
      if (!d.nome && !d.email && !d.mensagem) return; /* não salva rascunho vazio */
      salvar(CHAVES.RASCUNHO, d);
      aviso.hidden = false;
    };
    function salvarRascunho() {
      clearTimeout(temporizador);
      temporizador = setTimeout(gravarAgora, 400);
    }
    /* Correção: se a aba for fechada antes dos 400 ms, grava na hora */
    window.addEventListener("pagehide", gravarAgora);
    form.addEventListener("input", salvarRascunho);
    form.addEventListener("change", salvarRascunho);

    const rascunho = ler(CHAVES.RASCUNHO);
    if (rascunho) {
      Object.entries(rascunho).forEach(([k, v]) => {
        if (k === "areas") v.forEach((a) => { const c = $(`input[name="areas"][value="${a}"]`, form); if (c) c.checked = true; });
        else if (k === "termos") $("#termos", form).checked = v;
        else if (form.elements[k]) form.elements[k].value = v;
      });
      atualizarContador();
      aviso.hidden = false;
      $(".form__alertas", form).innerHTML = alertaHTML("info", "Continuamos de onde você parou", "Recuperamos o rascunho salvo neste navegador.");
    }

    /* ---------- Lista de cadastros enviados ---------- */
    const listaEl = $("[data-cadastros]", app);
    const renderCadastros = () => {
      const lista = ler(CHAVES.VOLUNTARIOS, []);
      listaEl.innerHTML = lista.length
        ? lista.map((v, i) => `
          <li>
            <div><strong>${escaparHTML(v.nome)}</strong><span class="texto-sm texto-suave">${escaparHTML(v.cidade)}/${escaparHTML(v.uf)} · ${v.areas.map(escaparHTML).join(", ") || "Sem área definida"}</span></div>
            <button class="btn-icone" data-excluir="${i}" aria-label="Excluir cadastro de ${escaparHTML(v.nome)}">🗑</button>
          </li>`).join("")
        : `<li class="texto-suave">Nenhum cadastro enviado ainda.</li>`;
    };
    listaEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-excluir]");
      if (!b) return;
      const lista = ler(CHAVES.VOLUNTARIOS, []);
      lista.splice(Number(b.dataset.excluir), 1);
      salvar(CHAVES.VOLUNTARIOS, lista);
      renderCadastros();
      toast("Cadastro removido", "", "info", 2000);
    });
    renderCadastros();

    /* ---------- Limpar ---------- */
    const limpar = () => {
      clearTimeout(temporizador);
      form.reset();
      $$(".form__grupo", form).forEach((g) => g.classList.remove("form__grupo--erro", "form__grupo--sucesso"));
      $$(".form__erro", form).forEach((e) => (e.textContent = ""));
      campos.forEach((c) => delete c.dataset.tocado);
      remover(CHAVES.RASCUNHO);
      aviso.hidden = true;
      atualizarContador();
    };
    $("[data-limpar-form]", form).addEventListener("click", () => { limpar(); $(".form__alertas", form).innerHTML = ""; });

    /* ---------- Envio ---------- */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const validos = campos.map(marcar);
      const areas = $$('input[name="areas"]:checked', form);
      $("#areas-erro", form).textContent = areas.length ? "" : "Escolha pelo menos uma forma de ajudar.";
      const tudoOk = validos.every(Boolean) && areas.length > 0;
      const alertas = $(".form__alertas", form);
      if (!tudoOk) {
        const qtd = validos.filter((v) => !v).length + (areas.length ? 0 : 1);
        alertas.innerHTML = alertaHTML("erro", `Ops! ${qtd} ${qtd === 1 ? "campo precisa" : "campos precisam"} de atenção.`, "Corrija os itens destacados em vermelho.");
        $(".form__grupo--erro .form__campo, .form__grupo--erro input", form)?.focus();
        return;
      }
      const d = dadosDoForm();
      const lista = ler(CHAVES.VOLUNTARIOS, []);
      lista.push({ nome: d.nome, email: d.email, cidade: d.cidade, uf: d.uf.toUpperCase(), areas: d.areas, data: new Date().toISOString() });
      salvar(CHAVES.VOLUNTARIOS, lista);
      limpar();
      renderCadastros();
      alertas.innerHTML = alertaHTML("sucesso", `Bem-vindo(a) ao time, ${d.nome.split(" ")[0]}!`, "Recebemos seu cadastro e entraremos em contato em até 48 horas.");
      alertas.scrollIntoView({ behavior: "smooth", block: "center" });
      celebrarGrande();
      toast("Cadastro enviado! 🐾", "Obrigado por se juntar à Patinha Solidária.", "sucesso", 5000);
    });

    /* Limpeza chamada pelo router ao sair da página */
    return () => {
      clearTimeout(temporizador);
      window.removeEventListener("pagehide", gravarAgora);
    };
  }
};
