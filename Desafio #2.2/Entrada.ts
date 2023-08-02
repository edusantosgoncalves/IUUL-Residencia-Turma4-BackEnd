// Importando o módulo readline-sync para leitura dos dados do terminal
import * as Readline from "readline";
import { Moeda } from "./Moeda.js";
import { ConversaoMoeda } from "./Tipos.js";

export class Entrada {
  private entrada: Readline.Interface;
  private moeda: Moeda;

  constructor() {
    //Inicializando a interação com o terminal
    this.entrada = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    //Instanciando a classe Moeda no atributo moeda
    this.moeda = new Moeda();
  }

  //Função que obtem uma entrada do terminal
  receberEntrada(mensagem: string): Promise<string> {
    return new Promise((resolve) => {
      this.entrada.question(mensagem, (resposta) => {
        resolve(resposta);
      });
    });
  }

  //Função que fecha a interação com o terminal
  fecharEntrada(): void {
    this.entrada.close();
  }

  //Função que valida se uma entrada de moeda é válida
  validaEntradaMoeda(moeda: string) {
    if (moeda === "") return "Campo vazio!";
    if (moeda.length < 3) return "Campo incorreto! < 3 caracteres!";
    if (moeda.length > 3) return "Campo incorreto! > 3 caracteres!";

    return true;
  }

  //Função que valida se uma entrada de valor é valida
  validaEntradaValor(moeda: string) {
    if (isNaN(parseFloat(moeda))) return "Não foi inserido um valor!";
    if (parseFloat(moeda) < 0) return "Valor inválido! < 0!";

    return true;
  }

  //Função privada que imprime os dados após a conversão
  private imprimeConversao(resposta: ConversaoMoeda) {
    console.log(
      `\n${resposta.query.from} ${resposta.query.amount.toFixed(2)} => ${
        resposta.query.to
      } ${resposta.result.toFixed(2)}`
    );
    console.log(`Taxa: ${resposta.info.rate.toFixed(6)}\n`);
  }

  //Função que chama o atributo moeda e solicita a conversão
  async converteMoeda(
    origem: string,
    destino: string,
    moeda: string
  ): Promise<any> {
    await this.moeda
      .converteMoeda(origem.toUpperCase(), destino.toUpperCase(), Number(moeda))
      .then((resposta) => {
        //Se obtiver sucesso ao converter, imprima a resposta e retorne a Promise como resolvida
        this.imprimeConversao(resposta);
        return Promise.resolve();
      })
      .catch((e) => {
        //Se não obtiver sucesso, retorne a promise como rejeitada junto a mensagem de erro
        return Promise.reject(e);
      });
  }
}
