/* =========================================================
   Regras de validação reutilizáveis
   Cada regra devolve uma mensagem de erro ou "" quando válido.
   ========================================================= */
export function cpfValido(cpf) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const calc = (fatorInicial) => {
    let soma = 0;
    for (let i = 0; i < fatorInicial - 1; i++) soma += Number(d[i]) * (fatorInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calc(10) === Number(d[9]) && calc(11) === Number(d[10]);
}

export function idade(dataISO) {
  const nasc = new Date(dataISO + "T00:00:00");
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return anos;
}

export const regras = {
  obrigatorio: (v) => (v.trim() ? "" : "Este campo é obrigatório."),
  nome: (v) => (/^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/.test(v.trim()) ? "" : "Digite nome e sobrenome, só com letras."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Digite um e-mail válido, como nome@email.com."),
  cpf: (v) => (cpfValido(v) ? "" : "CPF inválido. Confira os números digitados."),
  telefone: (v) => (/^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) ? "" : "Use o formato (41) 99999-9999."),
  cep: (v) => (/^\d{5}-\d{3}$/.test(v) ? "" : "CEP deve ter 8 números, como 80000-000."),
  maiorIdade: (v) => (v && idade(v) >= 18 ? "" : "É preciso ter 18 anos ou mais para ser voluntário."),
  minimo10: (v) => (v.trim().length >= 10 ? "" : "Escreva pelo menos 10 caracteres."),
  marcado: (_, campo) => (campo.checked ? "" : "Você precisa aceitar os termos para continuar.")
};

/* Valida um campo com base no atributo data-regras="obrigatorio nome" */
export function validarCampo(campo) {
  const nomes = (campo.dataset.regras || "").split(" ").filter(Boolean);
  const valor = campo.type === "checkbox" ? "" : campo.value;
  for (const nome of nomes) {
    const erro = regras[nome](valor, campo);
    if (erro) return erro;
  }
  return "";
}
