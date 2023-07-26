import { DateTime } from "luxon";

//Importando classe que valida Pessoa
import ValidaPessoa from "./ValidaPessoa.js";

//Implementar leitura do JSON e exportação dos erros
export default class Arquivo {
  #listaErros;
  #validador;
  #arquivo;

  constructor() {
    this.#listaErros = [];
    this.#validador = new ValidaPessoa();
  }

  //Função que converte o conteúdo do arquivo (string) para JSON
  #formataArquivo(conteudoArquivo) {
    //Verificando se o conteúdo do arquivo está vazio
    if (conteudoArquivo.length === 0) return { erro: "Arquivo vazio!" };

    try {
      //Convertendo o conteudo do arquivo para JSON
      const objJSON = JSON.parse(conteudoArquivo);

      //Validando se o JSON contém array
      if (!Array.isArray(objJSON))
        return { erro: "O JSON não contém um array!" };
      else return objJSON;
    } catch (e) {
      return { erro: ("Erro ao obter o conteúdo do JSON: ", e) };
    }
  }

  //Validando o atributo arquivo
  validaArquivo() {
    //Declarando variável de erro que vai ser modificado a cada pessoa iterada
    let erroPessoa = {};

    for (const posicaoPessoa in this.#arquivo) {
      //Obtendo a pessoa
      const pessoa = this.#arquivo[posicaoPessoa];

      //Ajustando a variável de erro para ela e zerando os erros
      erroPessoa = { dados: pessoa, erros: [] };

      //Validando nome
      try {
        this.#validador.validaNome(pessoa.nome);
      } catch (e) {
        erroPessoa.erros.push(e);
      }

      //Validando cpf
      try {
        this.#validador.validaCPF(pessoa.cpf);
      } catch (e) {
        erroPessoa.erros.push(e);
      }

      //Validando data de nascimento
      try {
        this.#validador.validaDtNasc(pessoa.dt_nascimento);
      } catch (e) {
        erroPessoa.erros.push(e);
      }

      //Validando renda mensal
      try {
        this.#validador.validaRenda(pessoa.renda_mensal);
      } catch (e) {
        erroPessoa.erros.push(e);
      }

      //Validando estado civil
      try {
        this.#validador.validaEstadoCivil(pessoa.estado_civil);
      } catch (e) {
        erroPessoa.erros.push(e);
      }

      //Se houve algum erro, adicionar no array de erros
      if (erroPessoa.erros.length > 0) this.#listaErros.push(erroPessoa);
    }
  }

  //Função que recebe o conteúdo do arquivo, formata-o e salva-o no atributo arquivo
  processaArquivo(conteudoArquivo) {
    //Formatando o arquivo em JSON
    const arquivoJSON = this.#formataArquivo(conteudoArquivo);

    //Se ocorrer erro na formatação, gere-o
    if (arquivoJSON.hasOwnProperty("erro")) throw arquivoJSON.erro;

    //Senão, atribua-o ao atributo arquivo
    this.#arquivo = arquivoJSON;
  }

  //Função que exporta a lista de erros e o diretorio do arquivo de erros
  obterErros(diretorioArquivo) {
    const dtHoje = DateTime.now();
    const nomeArqErros = `${diretorioArquivo}/erros-${String(
      dtHoje.get("day")
    ).padStart(2, "0")}${String(dtHoje.get("month")).padStart(2, "0")}${String(
      dtHoje.get("year")
    ).padStart(2, "0")}-${String(dtHoje.get("hour")).padStart(2, "0")}${String(
      dtHoje.get("minute")
    ).padStart(2, "0")}${String(dtHoje.get("second")).padStart(2, "0")}.json`;

    return { nomeArquivoErros: nomeArqErros, listaErros: this.#listaErros };
  }
}
