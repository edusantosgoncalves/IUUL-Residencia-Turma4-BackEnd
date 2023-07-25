import * as fs from "fs";
import { DateTime } from "luxon";
import path from "path";
//Importando classe que valida Pessoa
import ValidaPessoa from "./ValidaPessoa.js";

//Declarando variável de erro e validação
var listaErros = [];
var validacoesPessoa = new ValidaPessoa();

//Validando se foi passado algum arquivo como parametro
if (process.argv.length < 3) {
  console.error("Não foi recebido arquivo como parâmetro!");
  process.exit(1);
}

// Obtendo o caminho do arquivo
const arquivo = process.argv[2];
//Validando se o arquivo é JSON
if (arquivo.split(".").pop() !== "json") {
  console.error("O arquivo recebido não é um JSON!");
  process.exit(0);
}
const diretorioArquivo = path.dirname(arquivo);

console.log(diretorioArquivo);
// Lendo o arquivo
fs.readFile(arquivo, "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    process.exit(0);
  }

  try {
    const objJSON = JSON.parse(data);

    //Validando se o JSON contém array
    if (!Array.isArray(objJSON)) {
      console.error("O JSON não contém um array!");
      process.exit(0);
    }

    //Validando os dados do JSON
    validarJSON(objJSON);

    //Exportando arquivo de erros e finalizando
    const dtHoje = DateTime.now();
    const nomeArqErros = `${diretorioArquivo}/erros-${String(
      dtHoje.get("day")
    ).padStart(2, "0")}${String(dtHoje.get("month")).padStart(2, "0")}${String(
      dtHoje.get("year")
    ).padStart(2, "0")}-${String(dtHoje.get("hour")).padStart(2, "0")}${String(
      dtHoje.get("minute")
    ).padStart(2, "0")}${String(dtHoje.get("second")).padStart(2, "0")}.json`;

    fs.writeFile(nomeArqErros, JSON.stringify(listaErros), (erroArq) => {
      if (erroArq) throw erroArq;
      console.log(
        `Validação completa!\nVocê pode conferir os erros no arquivo ${nomeArqErros}`
      );
    });
  } catch (e) {
    console.error("Erro ao obter o conteúdo do JSON: ", e);
    process.exit(0);
  }
});

function validarJSON(objJSON) {
  for (const posicaoPessoa in objJSON) {
    const pessoa = objJSON[posicaoPessoa];
    let erroPessoa = { dados: pessoa, erros: [] };

    //Validando nome
    try {
      validacoesPessoa.validaNome(pessoa.nome);
    } catch (e) {
      erroPessoa.erros.push(e);
    }

    //Validando cpf
    try {
      validacoesPessoa.validaCPF(pessoa.cpf);
    } catch (e) {
      erroPessoa.erros.push(e);
    }

    //Validando data de nascimento
    try {
      validacoesPessoa.validaDtNasc(pessoa.dt_nascimento);
    } catch (e) {
      erroPessoa.erros.push(e);
    }

    //Validando renda mensal
    try {
      validacoesPessoa.validaRenda(pessoa.renda_mensal);
    } catch (e) {
      erroPessoa.erros.push(e);
    }

    //Validando estado civil
    try {
      validacoesPessoa.validaEstadoCivil(pessoa.estado_civil);
    } catch (e) {
      erroPessoa.erros.push(e);
    }

    //Se houve algum erro, adicionar no array de erros
    if (erroPessoa.erros.length > 0) listaErros.push(erroPessoa);
  }
}
