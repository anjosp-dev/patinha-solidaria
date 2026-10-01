/* Testes automatizados das regras de validação.
   Executar com: npm test  (usa o executor nativo do Node.js, sem dependências) */
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpfValido, idade, regras } from "../patinha-solidaria/js/utils/validadores.js";

test("CPF válido é aceito (com e sem máscara)", () => {
  assert.equal(cpfValido("529.982.247-25"), true);
  assert.equal(cpfValido("52998224725"), true);
});

test("CPF com dígito verificador errado é rejeitado", () => {
  assert.equal(cpfValido("529.982.247-26"), false);
  assert.equal(cpfValido("123.456.789-00"), false);
});

test("CPF com todos os dígitos iguais ou tamanho errado é rejeitado", () => {
  assert.equal(cpfValido("111.111.111-11"), false);
  assert.equal(cpfValido("123"), false);
});

test("idade é calculada corretamente", () => {
  const hoje = new Date();
  const ano = hoje.getFullYear() - 20;
  const data = `${ano}-01-01`;
  assert.ok(idade(data) >= 19);
});

test("regra maiorIdade bloqueia menores de 18 anos", () => {
  const anoMenor = new Date().getFullYear() - 10;
  assert.notEqual(regras.maiorIdade(`${anoMenor}-06-15`), "");
  assert.equal(regras.maiorIdade("1990-06-15"), "");
});

test("regra nome exige nome e sobrenome só com letras", () => {
  assert.equal(regras.nome("Yuri Pereira"), "");
  assert.equal(regras.nome("José da Conceição"), "");
  assert.notEqual(regras.nome("Yuri"), "");
  assert.notEqual(regras.nome("Yuri 123"), "");
});

test("regra email valida o formato", () => {
  assert.equal(regras.email("contato@patinha.org"), "");
  assert.notEqual(regras.email("contato@"), "");
  assert.notEqual(regras.email("sem-arroba.com"), "");
});

test("regras de telefone, CEP, obrigatório e mínimo de caracteres", () => {
  assert.equal(regras.telefone("(41) 99124-0896"), "");
  assert.notEqual(regras.telefone("41991240896"), "");
  assert.equal(regras.cep("80010-000"), "");
  assert.notEqual(regras.cep("8001"), "");
  assert.notEqual(regras.obrigatorio("   "), "");
  assert.notEqual(regras.minimo10("curto"), "");
});
