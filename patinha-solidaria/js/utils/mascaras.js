/* =========================================================
   Máscaras de entrada (aplicadas enquanto o usuário digita)
   ========================================================= */
const soNumeros = (v) => v.replace(/\D/g, "");

export const mascaras = {
  cpf(v) {
    return soNumeros(v).slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  telefone(v) {
    const d = soNumeros(v).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },
  cep(v) {
    return soNumeros(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
  }
};

/* Liga as máscaras aos campos que tiverem data-mascara="cpf|telefone|cep" */
export function aplicarMascaras(contexto) {
  contexto.querySelectorAll("[data-mascara]").forEach((campo) => {
    const fn = mascaras[campo.dataset.mascara];
    campo.addEventListener("input", () => {
      campo.value = fn(campo.value);
    });
  });
}
