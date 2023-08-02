//Instanciando biblioteca de requisições HTTP
import axios from "axios";

//Importando tipo listaMoedas
import { ListaMoedas, ConversaoMoeda } from "./Tipos.js";
export class Moeda {
  private listaMoedas!: ListaMoedas; // !: - Forçando o TS a ignorar a regra de ter um valor padrão

  constructor() {
    try {
      //Chamando a função que preenche a lista de moedas
      const listaPreenchida: Promise<boolean> = this.preencheListaMoedas();

      //Validando o retorno da lista preenchida
      listaPreenchida.then((retorno) => {
        //Se ocorrer um erro, gere um erro
        if (retorno === false)
          throw Error(
            "Não foi possível obter a lista de tipos de moedas, por favor, tente novamente depois!"
          );
      });
    } catch (e) {
      throw Error(
        //Se ocorrer um erro, gere um erro
        "Não foi possível obter a lista de tipos de moedas, por favor, tente novamente depois!"
      );
    }
  }

  //Função que preenche a lista de moedas da classe
  private async preencheListaMoedas(): Promise<boolean> {
    try {
      const { data } = await axios.get<ListaMoedas>(
        "https://api.exchangerate.host/symbols"
      );

      //Se não houver sucesso, retorne uma promise como falso.
      if (data.success !== true) return Promise.reject(false);

      //Se houver sucesso na obtenção da base de simbolos, atribua-os ao atributo listaMoedas e retorne a promise como verdadeira
      this.listaMoedas = data;
      return Promise.resolve(true);
    } catch (e) {
      //Se ocorrer erros ao obter a base de simbolos,gere uma exceção
      throw `Erro ao preencher lista! ${e}`;
    }
  }

  //Função que busca na lista de moedas da classe a existência de uma moeda (simbolo)
  private validaExisteMoeda(moedaRecebida: string): boolean {
    //Buscando a moeda recebida na lista de moedas
    const vrfExiste = Object.values(this.listaMoedas.symbols).find((moeda) => {
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
  ): Promise<any> {
    //Validando se as 2 moedas são iguais
    if (origem === destino)
      return "Erro ao converter: As moedas não podem ser iguais (origem = destino)!";

    //Validando se alguma das moedas inseridas existe
    if (this.validaExisteMoeda(origem) === false)
      throw `Erro ao converter: Moeda de origem (${origem}) não existente!`;

    if (this.validaExisteMoeda(destino) === false)
      throw `Erro ao converter: Moeda de destino (${destino}) não existente!`;

    //Solicitando a conversão para a api
    try {
      const { data } = await axios.get<ConversaoMoeda>(
        `https://api.exchangerate.host/convert`,
        { params: { from: origem, to: destino, amount: valor } }
      );
      //Se não houver sucesso na resposta da API, gere um erro.
      if (data.success !== true)
        throw `Erro na comunicação com a API! Não foi possível obter a conversão via API!`;

      //Se houver sucesso, retorne-a
      return data;
    } catch (e) {
      //Se ocorrer um erro, gere um erro.
      throw `Erro na comunicação com a API! ${e}`;
    }
  }
}
