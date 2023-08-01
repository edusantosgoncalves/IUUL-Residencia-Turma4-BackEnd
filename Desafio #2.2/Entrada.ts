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

  // Função para receber a entrada do usuário
  private async receberEntrada(mensagem: string): Promise<string> {
    //Declarando variável que receberá o valor da entrada
    let recebido: string = "";

    await this.entrada.question(mensagem, (resposta) => {
      //Atribuindo o valor da resposta a variável "recebido"
      recebido = resposta;

      //Fechando a interação com o terminal
      this.entrada.close();
    });

    //Retornando o valor recebido
    return recebido;
  }

  private validaEntradaMoeda(moeda: string) {
    if (moeda === "") return "Campo vazio!";
    if (moeda.length < 3) return "Campo incorreto! < 3 caracteres!";
    if (moeda.length > 3) return "Campo incorreto! > 3 caracteres!";

    return true;
  }
  private validaEntradaMoedaP(moedaPromise: Promise<string>) {
    moedaPromise.then((moeda) => {
      if (moeda === "") return "Campo vazio!";
      if (moeda.length < 3) return "Campo incorreto! < 3 caracteres!";
      if (moeda.length > 3) return "Campo incorreto! > 3 caracteres!";
    });

    return true;
  }

  private validaEntradaValor(moeda: string) {
    if (isNaN(parseFloat(moeda))) return "Não foi inserido um valor!";

    if (parseFloat(moeda) < 0) return "Valor inválido! < 0!";

    return true;
  }

  private validaEntradaValorP(valorPromise: Promise<string>) {
    valorPromise.then((valor) => {
      if (isNaN(parseFloat(valor))) return "Não foi inserido um valor!";
      if (parseFloat(valor) < 0) return "Valor inválido! < 0!";
    });

    return true;
  }

  private imprimeConversao(resposta: ConversaoMoeda) {}

  private converteMoeda(origem: string, destino: string, moeda: string) {
    const nvMoeda: number = Number(moeda);

    let resposta: Promise<ConversaoMoeda> = this.moeda.converteMoeda(
      origem,
      destino,
      nvMoeda
    );

    resposta.then((respostaMoeda) => {
      console.log(respostaMoeda);
      this.imprimeConversao(respostaMoeda);
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

  menu2(): boolean {
    //while (true) {
    let origem: Promise<string> = this.receberEntrada("MOEDA ORIGEM: ");
    let vrf: any = this.validaEntradaMoedaP(origem);

    //Validando entrada
    while (vrf !== true) {
      //Se o usuário não inserir uma string em "moeda origem", encerre o programa
      if (vrf === "Campo vazio") return false;

      origem = this.receberEntrada(`${vrf} MOEDA ORIGEM: `);
      vrf = this.validaEntradaMoedaP(origem);
    }

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
  }
  teste() {
    console.log("test");
  }
}
