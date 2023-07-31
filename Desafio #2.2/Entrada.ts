// Importando o módulo readline-sync para leitura dos dados do terminal
import * as Readline from "readline";

export class Entrada {
  private entrada: Readline.Interface;

  constructor() {
    //Inicializando a interação com o terminal
    this.entrada = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // Função para receber a entrada do usuário
  private receberEntrada(mensagem: string): string {
    //Declarando variável que receberá o valor da entrada
    let recebido: string = "";

    this.entrada.question(mensagem, (resposta) => {
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

  private validaEntradaValor(moeda: string) {
    if (isNaN(parseFloat(moeda))) return "Não foi inserido um valor!";

    if (parseFloat(moeda) < 0) return "Valor inválido! < 0!";

    return true;
  }

  menu(): void {
    let origem: string = this.receberEntrada("MOEDA ORIGEM: ");
    let vrf: any = this.validaEntradaMoeda(origem);

    //Validando entrada
    while (vrf !== true) {
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
  }
}