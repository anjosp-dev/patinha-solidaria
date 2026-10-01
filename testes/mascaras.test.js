/* Testes das máscaras de entrada */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mascaras } from "../patinha-solidaria/js/utils/mascaras.js";

test("máscara de CPF formata enquanto digita", () => {
  assert.equal(mascaras.cpf("52998224725"), "529.982.247-25");
  assert.equal(mascaras.cpf("5299"), "529.9");
  assert.equal(mascaras.cpf("abc529.982.247-25999"), "529.982.247-25");
});

test("máscara de telefone aceita fixo e celular", () => {
  assert.equal(mascaras.telefone("41991240896"), "(41) 99124-0896");
  assert.equal(mascaras.telefone("4133334444"), "(41) 3333-4444");
  assert.equal(mascaras.telefone("41"), "(41");
});

test("máscara de CEP", () => {
  assert.equal(mascaras.cep("80010000"), "80010-000");
  assert.equal(mascaras.cep("800"), "800");
});
