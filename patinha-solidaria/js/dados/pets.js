/* =========================================================
   Dados dos pets para adoção
   (em um sistema real, viriam de uma API do back-end)
   ========================================================= */
export const PETS = [
  {
    id: 1, nome: "Thor", especie: "cao", sexo: "Macho", porte: "medio", idade: "adulto", idadeTexto: "3 anos",
    img: "imagens/pets/thor.svg", energia: 3, apartamento: false, criancas: true,
    tags: ["Brincalhão", "Ama passeios", "Vacinado", "Castrado"],
    resumo: "Parceiro de aventuras que nunca recusa uma bolinha.",
    historia: "Thor foi encontrado vagando perto de uma rodovia, magro e assustado. Hoje é pura energia: adora correr, brincar de buscar e receber carinho na barriga."
  },
  {
    id: 2, nome: "Mel", especie: "cao", sexo: "Fêmea", porte: "pequeno", idade: "filhote", idadeTexto: "4 meses",
    img: "imagens/pets/mel.svg", energia: 2, apartamento: true, criancas: true,
    tags: ["Dócil", "Filhote", "Vacinada", "Ideal p/ apartamento"],
    resumo: "Um docinho de filhote que se aconchega em qualquer colo.",
    historia: "Mel nasceu em uma ninhada resgatada de um terreno baldio. É carinhosa, curiosa e já está aprendendo a fazer as necessidades no lugar certo."
  },
  {
    id: 3, nome: "Luna", especie: "gato", sexo: "Fêmea", porte: "pequeno", idade: "adulto", idadeTexto: "2 anos",
    img: "imagens/pets/luna.svg", energia: 1, apartamento: true, criancas: false,
    tags: ["Calma", "Independente", "Castrada", "Vacinada"],
    resumo: "Serena e observadora, perfeita para quem busca tranquilidade.",
    historia: "Luna foi deixada em uma caixa na porta de um mercado. Desconfiada no começo, hoje ama um cantinho ensolarado e ronrona alto quando ganha carinho."
  },
  {
    id: 4, nome: "Simba", especie: "gato", sexo: "Macho", porte: "pequeno", idade: "filhote", idadeTexto: "5 meses",
    img: "imagens/pets/simba.svg", energia: 3, apartamento: true, criancas: true,
    tags: ["Agitado", "Curioso", "Vacinado", "Sociável"],
    resumo: "Um pequeno leão que transforma qualquer barbante em festa.",
    historia: "Simba foi resgatado de dentro de um motor de carro em um dia de chuva. Cheio de energia, adora brinquedos de varinha e se dá bem com outros gatos."
  },
  {
    id: 5, nome: "Bob", especie: "cao", sexo: "Macho", porte: "grande", idade: "idoso", idadeTexto: "9 anos",
    img: "imagens/pets/bob.svg", energia: 1, apartamento: false, criancas: true,
    tags: ["Tranquilo", "Idoso", "Castrado", "Muito leal"],
    resumo: "Um senhor gentil que só quer um sofá e companhia.",
    historia: "Bob viveu anos acorrentado em um quintal até ser resgatado após denúncia. Mesmo assim, confia nas pessoas e é o cão mais educado do abrigo."
  },
  {
    id: 6, nome: "Nina", especie: "gato", sexo: "Fêmea", porte: "pequeno", idade: "idoso", idadeTexto: "8 anos",
    img: "imagens/pets/nina.svg", energia: 1, apartamento: true, criancas: true,
    tags: ["Carinhosa", "Idosa", "Castrada", "Olhos azuis"],
    resumo: "Doce, silenciosa e dona do olhar mais azul do abrigo.",
    historia: "Nina perdeu a tutora e ficou sozinha em casa por dias até vizinhos acionarem a ONG. É extremamente carinhosa e adora dormir perto das pessoas."
  },
  {
    id: 7, nome: "Paçoca", especie: "cao", sexo: "Fêmea", porte: "medio", idade: "adulto", idadeTexto: "4 anos",
    img: "imagens/pets/pacoca.svg", energia: 2, apartamento: true, criancas: true,
    tags: ["Equilibrada", "Obediente", "Vacinada", "Castrada"],
    resumo: "Equilibrada e esperta, aprende comandos em minutos.",
    historia: "Paçoca foi resgatada de uma situação de maus-tratos. Recuperada, virou a queridinha dos voluntários por ser calma dentro de casa e animada nos passeios."
  },
  {
    id: 8, nome: "Frajola", especie: "gato", sexo: "Macho", porte: "medio", idade: "adulto", idadeTexto: "3 anos",
    img: "imagens/pets/frajola.svg", energia: 2, apartamento: true, criancas: true,
    tags: ["Brincalhão", "Tagarela", "Castrado", "Vacinado"],
    resumo: "Conversador e cheio de personalidade, vai te receber na porta.",
    historia: "Frajola apareceu em uma obra e ficou amigo dos pedreiros, que chamaram a ONG. É sociável, mia para conversar e adora caixas de papelão."
  }
];

export const ROTULOS = {
  especie: { cao: "Cachorro", gato: "Gato" },
  porte: { pequeno: "Pequeno", medio: "Médio", grande: "Grande" },
  idade: { filhote: "Filhote", adulto: "Adulto", idoso: "Idoso" }
};

export const buscarPet = (id) => PETS.find((p) => p.id === Number(id));
