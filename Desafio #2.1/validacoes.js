//Importando classe do arquivo
import Arquivo from "./Arquivo.js";
import path from "path";
import * as fs from "fs";

//Declarando variável de erro e validação
const arquivoClasse = new Arquivo();

//Validando se foi passado algum arquivo como parametro
if (process.argv.length < 3) {
  console.error("Não foi recebido arquivo como parâmetro!");
  process.exit(1);
}

// Obtendo o caminho do arquivo
const nomeArquivo = process.argv[2];

//Validando se o arquivo é JSON
if (nomeArquivo.split(".").pop() !== "json") {
  console.error("O arquivo recebido não é um JSON!");
  process.exit(1);
}

//Obtendo o diretório do arquivo
const diretorioArquivo = path.dirname(nomeArquivo);

// Lendo o arquivo
fs.readFile(nomeArquivo, "utf8", (err, data) => {
  //Se ocorrer erro na leitura, apresente-o e encerre
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    process.exit(1);
  }

  //Senão, processe o arquivo
  try {
    arquivoClasse.processaArquivo(data);
  } catch (e) {
    //Caso haja erro no processamento do arquivo, apresente-o e encerre
    console.error("Erro no processamento do arquivo:", e);
    process.exit(1);
  }

  //Validando o conteúdo do arquivo
  arquivoClasse.validaArquivo();

  //Obtendo os erros
  const erros = arquivoClasse.obterErros(diretorioArquivo);

  //Exportando os erros
  try {
    fs.writeFile(
      erros.nomeArquivoErros,
      JSON.stringify(erros.listaErros),
      (erroArq) => {
        if (erroArq) throw erroArq;
        console.log(
          `Validação finalizada!\nVocê pode conferir os erros no arquivo ${erros.nomeArquivoErros}`
        );
      }
    );
  } catch (e) {
    //Caso haja erro na exportação do arquivo de erros, apresente-o e encerre
    console.error(e);
    process.exit(1);
  }
});
