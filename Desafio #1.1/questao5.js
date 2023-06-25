//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Definindo função que vai retornar os erros
function obterMensagemErro(variavel, entrada) {
  //Nome = 1
  if (variavel === 1) {
    if (typeof entrada !== "string") return "Tipo incorreto";
    return "Tamanho incorreto";
  }
  //CPF = 2
  if (variavel === 2) {
    if (!isNaN(entrada)) return "Tipo incorreto!";
    return "Quantidade de digitos != 11!";
  }

  //Data Nascimento = 3
  if (variavel === 3) {
    if (!(new Date(entrada) instanceof Date)) return "Tipo incorreto!";
    /* VALIDAR SE O CLIENTE TEM >= 18 ANOS */
    return "Formato de data incorreto!";
  }

  //Renda = 4
  if (variavel === 4) {
    if (!isNaN(entrada)) return "Tipo incorreto!";
    return "Valor < 0";
  }

  //Dependentes = 6
  if (variavel === 6) {
    if (!isNaN(entrada)) return "Tipo incorreto!";
    return "Valor inválido!";
  }
}

let entrada;
console.log("---- CLIENTE ----");
let cliente;

//Solicitando nome
entrada = prompt("Insira o nome (ao menos 5 caracteres): ");
while (typeof entrada !== "string" || entrada.length < 5) {
  entrada = prompt(`${obterMensagemErro(1, entrada)}\nInsira o nome: `);
}

cliente.nome = entrada;

//Solicitando CPF
entrada = prompt("Insira o CPF (somente os 11 dígitos): ");
while (!isNaN(entrada) || entrada.length === 11) {
  entrada = prompt(`${obterMensagemErro(2, entrada)}\nInsira o CPF: `);
}
cliente.cpf = entrada;

//Solicitando data de nascimento
const vrfData = /^([0-2][0-9]|3[0-1])\/(0[0-9]|1[0-2])\/[0-9]{4}$/;

entrada = prompt("Insira a data de nascimento (DD/MM/AAAA): ");
while (
  !(new Date(entrada) instanceof Date) ||
  vrfData.test(entrada) /* VALIDAR SE O CLIENTE TEM >= 18 ANOS */
) {
  entrada = prompt(
    `${obterMensagemErro(
      3,
      entrada
    )}\nInsira a data de nascimento (DD/MM/AAAA): `
  );
}
cliente.dtNasc = entrada;

//Solicitando renda mensal
entrada = prompt("Insira a renda mensal (somente valor): R$ ");
while (!isNaN(entrada) || entrada < 0) {
  entrada = prompt(
    `${obterMensagemErro(
      4,
      entrada
    )}\nInsira a renda mensal (somente valor): R$ `
  );
}

cliente.rendaMensal = entrada;

//Solicitando estado civil
entrada = prompt(
  `Qual seu estado civil?\n(C): Casado / (S): Solteiro / (V): Viúvo / (D): Divorciado\n`
);
while (
  //Se não atender estas condições, solicite novamente
  //Casado
  entrada !== "C" &&
  entrada !== "c" &&
  //Solteiro
  entrada !== "S" &&
  entrada !== "s" &&
  //Viúvo
  entrada !== "V" &&
  entrada !== "v" &&
  //Divorciado
  entrada !== "D" &&
  entrada !== "d"
) {
  entrada = prompt(
    `OPÇÃO INVÁLIDA!\nQual seu estado civil?\n(C): Casado / (S): Solteiro / (V): Viúvo / (D): Divorciado\n`
  );
}

cliente.estadoCivil = entrada;

//Solicitando dependentes
entrada = prompt("Insira a quantidade de dependentes: ");
while (!isNaN(entrada) || entrada < 0 || entrada > 10) {
  entrada = prompt(
    `${obterMensagemErro(
      6,
      entrada
    )}\nInsira a renda mensal (somente valor): R$ `
  );
}

cliente.dependentes = entrada;

// Imprimir os dados na tela (CPF com mascara, renda com 2 casas decimais e data com máscara)
