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
    this.moeda = new Moeda();
  }

  receberEntrada(mensagem: string): Promise<string> {
    return new Promise((resolve) => {
      this.entrada.question(mensagem, (resposta) => {
        resolve(resposta);
      });
    });
  }

  fecharEntrada(): void {
    this.entrada.close();
  }

  validaEntradaMoeda(moeda: string) {
    if (moeda === "") return "Campo vazio!";
    if (moeda.length < 3) return "Campo incorreto! < 3 caracteres!";
    if (moeda.length > 3) return "Campo incorreto! > 3 caracteres!";

    return true;
  }

  validaEntradaValor(moeda: string) {
    if (isNaN(parseFloat(moeda))) return "Não foi inserido um valor!";

    if (parseFloat(moeda) < 0) return "Valor inválido! < 0!";

    return true;
  }

  imprimeConversao(resposta: ConversaoMoeda) {
    console.log(
      `${resposta.query.from} ${resposta.query.amount.toFixed(2)} => ${
        resposta.query.to
      } ${resposta.result.toFixed(2)}`
    );
    console.log(`Taxa: ${resposta.info.rate.toFixed(6)}`);
  }

  async converteMoeda(origem: string, destino: string, moeda: string) {
    const nvMoeda: number = Number(moeda);
    this.moeda
      .converteMoeda(origem, destino, nvMoeda)
      .then((resposta) => {
        console.log(resposta);
        //if (typeof resposta !== "string") {
        this.imprimeConversao(resposta);
        //} else throw `Erro ao converter: ${resposta}`;
      })
      .catch((e) => {
        return `Erro ao converter: ${e}`;
      });
  }
  /*
  menu(): boolean {
    //while (true) {
    let origem: string = this.receberEntrada("MOEDA ORIGEM: ");
    let vrf: any = this.validaEntradaMoeda(origem);

    //Validando entrada
    while (vrf !== true) {
      //Se o usuário não inserir uma string em "moeda origem", encerre o programa
      if (vrf === "Campo vazio") return false;

      origem = this.receberEntrada(`${vrf} MOEDA ORIGEM: `);
      vrf = this.validaEntradaMoeda(origem);
    }

    let destino: string = this.receberEntrada("MOEDA DESTINO: ");
    vrf = this.validaEntradaMoeda(destino);

    //Validando entrada
    while (vrf !== true) {
      destino = this.receberEntrada(`${vrf} MOEDA DESTINO: `);
      vrf = this.validaEntradaMoeda(destino);
    }

    let valor: string = this.receberEntrada("VALOR: ");
    vrf = this.validaEntradaValor(valor);

    //Validando entrada
    while (vrf !== true) {
      valor = this.receberEntrada(`${vrf} VALOR: `);
      vrf = this.validaEntradaValor(valor);
    }

    //Chamar função que obtenha a conversão dos valores!
    this.converteMoeda(origem, destino, valor);

    return true;
    // }
  }
*/
  /*
  async menu2(): Promise<boolean> {
    //while (true) {
    let origem: string = await this.receberEntrada("MOEDA ORIGEM: ");
    let vrf: any = this.validaEntradaMoeda(origem);

    //Validando entrada
    while (vrf !== true) {
      //Se o usuário não inserir uma string em "moeda origem", encerre o programa
      if (vrf === "Campo vazio") return false;

      origem = await this.receberEntrada(`${vrf} MOEDA ORIGEM: `);
      vrf = this.validaEntradaMoeda(origem);
    }
    console.log("Consegui " + origem);
    let destino: Promise<string> = this.receberEntrada("MOEDA DESTINO: ");
    vrf = this.validaEntradaMoedaP(destino);

    //Validando entrada
    while (vrf !== true) {
      destino = this.receberEntrada(`${vrf} MOEDA DESTINO: `);
      vrf = this.validaEntradaMoedaP(destino);
    }

    let valor: Promise<string> = this.receberEntrada("VALOR: ");
    vrf = this.validaEntradaValorP(valor);

    //Validando entrada
    while (vrf !== true) {
      valor = this.receberEntrada(`${vrf} VALOR: `);
      vrf = this.validaEntradaValorP(valor);
    }

    //Chamar função que obtenha a conversão dos valores!
    //this.converteMoeda(origem, destino, valor);

    return true;
    // }
  }*/
}
