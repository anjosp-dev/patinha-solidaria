/* Página: 404 */
export default {
  titulo: "Página não encontrada",
  render() {
    return `
    <section class="container vazio vazio--pagina">
      <span>🐕‍🦺</span>
      <h1>Ops! Essa página fugiu</h1>
      <p class="texto-suave">Não encontramos o que você procurava. Que tal voltar para o início?</p>
      <a class="btn btn--primario" href="#/inicio">Voltar ao início</a>
    </section>`;
  }
};
