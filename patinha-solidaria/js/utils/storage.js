/* =========================================================
   Camada de acesso ao localStorage
   Centraliza leitura e escrita com tratamento de erros
   (modo anônimo, armazenamento cheio ou bloqueado).
   ========================================================= */
const PREFIXO = "patinha:";

export const CHAVES = {
  MATCHES: "matches",
  DOACOES: "doacoes",
  VOLUNTARIOS: "voluntarios",
  RASCUNHO: "rascunho-cadastro",
  PEDIDOS_ADOCAO: "pedidos-adocao",
  RESULTADO_QUIZ: "resultado-quiz",
  PETS_VISTOS: "pets-vistos"
};

export function ler(chave, padrao = null) {
  try {
    const valor = localStorage.getItem(PREFIXO + chave);
    return valor === null ? padrao : JSON.parse(valor);
  } catch (erro) {
    console.warn("[storage] Não foi possível ler", chave, erro);
    return padrao;
  }
}

export function salvar(chave, valor) {
  try {
    localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn("[storage] Não foi possível salvar", chave, erro);
    return false;
  }
}

export function remover(chave) {
  try { localStorage.removeItem(PREFIXO + chave); } catch (erro) { /* ignora */ }
}

/* Pequeno sistema de eventos: avisa outras partes da tela quando algo muda */
const ouvintes = {};
export function aoMudar(chave, callback) {
  (ouvintes[chave] ||= []).push(callback);
  /* devolve uma função para cancelar a inscrição (usada ao trocar de página) */
  return () => { ouvintes[chave] = ouvintes[chave].filter((cb) => cb !== callback); };
}
export function avisar(chave, valor) {
  (ouvintes[chave] || []).forEach((cb) => cb(valor));
}
