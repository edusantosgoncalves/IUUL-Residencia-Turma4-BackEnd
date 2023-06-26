//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Definindo função que retorna a idade do cliente
function obterIdade(data) {
  let dataSplit = data.split("/");
  let dataNasc = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
  const dtHoje = new Date();
  let idade = dtHoje.getFullYear() - dataNasc.getFullYear();

  const mesAtual = dtHoje.getMonth();
  const mesNasc = dataNasc.getMonth();
  const diaAtual = dtHoje.getDate();
  const diaNasc = dataNasc.getDate();

  if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
    idade--;
  }

  return idade;
}

//Definindo função que retorna o estado civil por extenso
function obterEstadoCivil(caracter) {
  if (caracter === "C" || caracter === "c") return "Casado(a)";
  if (caracter === "S" || caracter === "s") return "Solteiro(a)";
  if (caracter === "V" || caracter === "v") return "Viúvo(a)";
  if (caracter === "D" || caracter === "d") return "Divorciado(a)";
}

//Definindo função que vai retornar os erros
function obterMensagemErro(variavel, entrada) {
  //Nome = 1
  if (variavel === 1) {
    if (typeof entrada !== "string") return "Tipo incorreto";
    return "Tamanho incorreto";
  }
  //CPF = 2
  if (variavel === 2) {
    if (isNaN(entrada)) return "Tipo incorreto!";
    return "Quantidade de digitos != 11!";
  }

  //Data Nascimento = 3
  if (variavel === 3) {
    if (!(new Date(entrada) instanceof Date)) return "Tipo incorreto!";
    if (obterIdade(entrada) < 18) return "Idade não permitida!";
    return "Formato de data incorreto!";
  }

  //Renda = 4
  if (variavel === 4) {
    if (isNaN(entrada)) return "Tipo incorreto!";
    return "Valor < 0";
  }

  //Dependentes = 6
  if (variavel === 6) {
    if (isNaN(entrada)) return "Tipo incorreto!";
    return "Valor inválido!";
  }
}

//Definindo função que formata o cpf
function formatarCPF(cpf) {
  return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(
    6,
    9
  )}-${cpf.substring(9)}`;
}

//Definindo função que formata a Data
function formatarData(data) {
  return data.toLocaleDateString();
}

//Definindo função que formata a renda
function formatarRenda(renda) {
  return entrada.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

//Solicitando dados do Cliente
let entrada;
console.log("---- CLIENTE ----");
let cliente = {};

//Solicitando nome
entrada = prompt("Insira o nome (ao menos 5 caracteres): ");
while (typeof entrada !== "string" || entrada.length < 5) {
  entrada = prompt(`${obterMensagemErro(1, entrada)}\nInsira o nome: `);
}

cliente.nome = entrada;

//Solicitando CPF
entrada = prompt("Insira o CPF (somente os 11 dígitos): ");
while (isNaN(entrada) || entrada.length !== 11) {
  console.log(entrada.length);
  entrada = prompt(`${obterMensagemErro(2, entrada)}\nInsira o CPF: `);
}
cliente.cpf = entrada;

//Solicitando data de nascimento
const vrfData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

entrada = prompt("Insira a data de nascimento (DD/MM/AAAA): ");
while (
  !(new Date(entrada) instanceof Date) ||
  !vrfData.test(entrada) ||
  obterIdade(entrada) < 18 /* VALIDAR SE O CLIENTE TEM >= 18 ANOS */
) {
  entrada = prompt(
    `${obterMensagemErro(
      3,
      entrada
    )}\nInsira a data de nascimento (DD/MM/AAAA): `
  );
}
const dataInserida = entrada.split("/");
cliente.dtNasc = new Date(
  dataInserida[2],
  dataInserida[1] - 1,
  dataInserida[0]
);

//Solicitando renda mensal
entrada = prompt("Insira a renda mensal (somente valor): R$ ");
while (isNaN(entrada) || entrada < 0) {
  entrada = prompt(
    `${obterMensagemErro(
      4,
      entrada
    )}\nInsira a renda mensal (somente valor): R$ `
  );
}

cliente.rendaMensal = parseFloat(entrada);

//Solicitando estado civil
entrada = prompt(
  `Qual seu estado civil? (C): Casado / (S): Solteiro / (V): Viúvo / (D): Divorciado - `
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

cliente.estadoCivil = obterEstadoCivil(entrada);

//Solicitando dependentes
entrada = prompt("Insira a quantidade de dependentes: ");
while (isNaN(entrada) || entrada < 0 || entrada > 10) {
  entrada = prompt(
    `${obterMensagemErro(
      6,
      entrada
    )}\nInsira a renda mensal (somente valor): R$ `
  );
}

cliente.dependentes = entrada;

// Imprimir os dados na tela (CPF com mascara, renda com 2 casas decimais e data com máscara)
let impressao = `\n------ ${cliente.nome.toUpperCase()} ------\n`;
impressao += `CPF: ${formatarCPF(cliente.cpf)}\n`;
impressao += `Data Nascimento: ${formatarData(cliente.dtNasc)}\n`;
impressao += `Renda Mensal: ${formatarRenda(cliente.rendaMensal)}\n`;
impressao += `Estado Civil: ${cliente.estadoCivil}\n`;
impressao += `Dependentes: ${cliente.dependentes}`;

console.log(impressao);
