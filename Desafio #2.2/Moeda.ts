//Instanciando biblioteca de requisições HTTP
import axios from "axios";

//Importando tipo listaMoedas
import { ListaMoedas, ConversaoMoeda } from "./Tipos.js";

export class Moeda {
  private listaMoedas!: ListaMoedas; // !: - Forçando o TS a ignorar a regra de ter um valor padrão

  constructor() {
    try {
      const listaPreenchida: Promise<boolean> = this.preencheListaMoedas();

      listaPreenchida.then((retorno) => {
        if (retorno === false)
          throw Error(
            "Não foi possível obter a lista de tipos de moedas, por favor, tente novamente depois!"
          );
      });
    } catch (e) {
      throw Error(
        "Não foi possível obter a lista de tipos de moedas, por favor, tente novamente depois!"
      );
    }
  }

  //Função que preenche a lista de moedas da classe
  private async preencheListaMoedas(): Promise<boolean> {
    const { data } = await axios.get<ListaMoedas>(
      "https://api.exchangerate.host/symbols"
    );

    if (data.success) {
      this.listaMoedas = data;
    } else return Promise.resolve(false);
    return Promise.resolve(true);
  }

  //Função que busca na lista de moedas da classe a existência de uma moeda (simbolo)
  private validaExisteMoeda(moedaRecebida: string): boolean {
    //Buscando a moeda recebida na lista de moedas
    const vrfExiste = this.listaMoedas.symbols.filter((moeda) => {
      return moeda.code === moedaRecebida;
    });

    //Se ela for encontrada, retorne verdadeiro
    if (vrfExiste !== undefined) return true;

    //Senão, retorne falso
    return false;
  }

  //Função que faz a conversão de um tipo de moeda a outro
  async converteMoeda(
    origem: string,
    destino: string,
    valor: number
  ): Promise<ConversaoMoeda> {
    //Validando se as 2 moedas são iguais
    if (origem === destino)
      throw "As moedas não podem ser iguais (origem = destino)!";

    //Validando se alguma das moedas inseridas existe
    if (!this.validaExisteMoeda(origem))
      throw `Moeda de origem (${origem}) não existente!`;

    if (!this.validaExisteMoeda(destino))
      throw `Moeda de origem (${destino}) não existente!`;

    const { data } = await axios.get<ConversaoMoeda>(
      `https://api.exchangerate.host/convert`,
      { params: { from: origem, to: destino, amount: valor } }
    );

    return data;
  }
}
