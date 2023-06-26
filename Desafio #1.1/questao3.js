//Importando classes
import Poligono from "./Formas/Poligono.js";

//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Definindo regex da entrada dos vértices
const vrfEntrada = /^(\d+),(\d+)$/;

//Polígono
console.log("---- POLÍGNO ----");
let vetorVertices = [];
let entrada;
let menuVertices = true;

while (menuVertices) {
  entrada = prompt("Insira um vértice (x,y) no formato x,y: ");

  while (!vrfEntrada.test(entrada)) {
    console.log("Vértices inseridos incorretamente!");
    entrada = prompt("Insira um vértice (x,y) no formato x,y: ");
  }

  let dadosVertice = entrada.split(",");
  vetorVertices.push({ x: dadosVertice[0], y: dadosVertice[1] });

  entrada = prompt("Você deseja adicionar outro vértice? Sim (S) ou Não (N)? ");

  while (
    entrada !== "N" &&
    entrada !== "S" &&
    entrada !== "s" &&
    entrada !== "n"
  ) {
    entrada = prompt(
      "INCORRETO!\nVocê deseja adicionar outro vértice? Sim (S) ou Não (N)? "
    );
  }

  if (entrada === "N" || entrada === "n") menuVertices = false;
}

let poligono = null;
try {
  poligono = new Poligono(vetorVertices);
} catch (e) {
  console.log(`${e}`);
}

//Chamando os métodos implementados na classe:
if (poligono !== null) {
  //Inserindo um novo vértice: (addVertice)
  entrada = prompt("Insira no polígono um novo vértice (x,y) no formato x,y: ");

  while (!vrfEntrada.test(entrada)) {
    console.log("Vértices inseridos incorretamente!");
    entrada = prompt("Insira um vértice (x,y) no formato x,y: ");
  }

  let dadosVertice = entrada.split(",");

  console.log();
  console.log(
    `Vertice adicionada? ${
      poligono.addVertice({ x: dadosVertice[0], y: dadosVertice[1] })
        ? "Sim"
        : "Não"
    }`
  );

  //Obtendo qtd de vértices:
  console.log(
    `\nPolígono:\n - Quantidade de vértices: ${poligono.qtdVertices}`
  );
  console.log(` - Perimetro: ${poligono.perimetro}`);
}
