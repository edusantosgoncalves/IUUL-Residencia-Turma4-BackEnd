//Importando classe Entrada
import { Entrada } from "./Entrada.js";

//Instanciando classe Entrada
const entrada = new Entrada();

//Declarando variável booleana que controlará a execução do menu
let menu: boolean = true;

//Enquando a variável for true, repita as operações
while (menu) {
  //Obtenha a entrada da moeda origem
  let moedaOrigem: string = await entrada.receberEntrada("MOEDA ORIGEM: ");

  //Valide a moeda origem
  let vrf: any = entrada.validaEntradaMoeda(moedaOrigem);

  //Verifique a validação da moeda origem
  while (vrf !== true) {
    //Se o usuário inserir uma string vazia em "moeda origem", encerre o programa
    if (vrf === "Campo vazio!") {
      menu = false; //Definindo a variável de controle do menu para falso
      break; //Saindo do loop do verificador da moeda origem
    }

    //Se ainda encontrou-se erro na verificação, apresente-o e solicite e valide novamente, até que passe na validação
    moedaOrigem = await entrada.receberEntrada(`${vrf} MOEDA ORIGEM: `);
    vrf = entrada.validaEntradaMoeda(moedaOrigem);
  }

  //Verificando se a variavel que controla o menu é falsa, se for, saia do loop
  if (menu === false) break;

  //Obtenha a entrada da moeda destino
  let moedaDestino: string = await entrada.receberEntrada("MOEDA DESTINO: ");

  //Valide a moeda destino
  vrf = entrada.validaEntradaMoeda(moedaDestino);

  //Verifique a validação da moeda destino
  while (vrf !== true) {
    //Se encontrou-se erro na verificação, apresente-o e solicite e valide novamente, até que passe na validação
    moedaDestino = await entrada.receberEntrada(`${vrf} MOEDA DESTINO: `);
    vrf = entrada.validaEntradaMoeda(moedaDestino);
  }

  //Obtenha a entrada do valor a ser convertido
  let valor: string = await entrada.receberEntrada("VALOR: ");

  //Valide o valor
  vrf = entrada.validaEntradaValor(valor);

  //Verifique a validação do valor
  while (vrf !== true) {
    //Se encontrou-se erro na verificação, apresente-o e solicite e valide novamente, até que passe na validação
    valor = await entrada.receberEntrada(`${vrf} VALOR: `);
    vrf = entrada.validaEntradaValor(valor);
  }

  //try {
  //Solicitando a conversão
  await entrada.converteMoeda(moedaOrigem, moedaDestino, valor).catch((e) => {
    console.error(e);
    menu = false;
  });
  /*} catch (e) {
    //Caso gere uma exceção, apresente-a e saia do menu
    console.error(e);
    menu = false;
  }*/
}

//Fechando interação com o terminal
entrada.fecharEntrada();
