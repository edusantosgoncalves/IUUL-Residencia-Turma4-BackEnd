//Importando classes
import Vertice from "./Vertice.js";

//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Obtendo dados do usuário para as vértices
let x;
let y;

//Vértice 1
console.log("---- VÉRTICES ----");
x = prompt("Digite o x do vertice 1: ");
while (isNaN(x)) {
  console.log("X não é número!");
  x = prompt("Digite o x do vertice 1: ");
}

y = prompt("Digite o y do vertice 1: ");
while (isNaN(y)) {
  console.log("Y não é número!");
  y = prompt("Digite o y do vertice 1: ");
}

const v1 = new Vertice(x, y);

//Vértice 2
x = prompt("Digite o x do vertice 2: ");
while (isNaN(x)) {
  console.log("X não é número!");
  x = prompt("Digite o x do vertice 2: ");
}

y = prompt("Digite o y do vertice 2: ");
while (isNaN(y)) {
  console.log("Y não é número!");
  y = prompt("Digite o y do vertice 2: ");
}

const v2 = new Vertice(x, y);

//Vértice 3
x = prompt("Digite o x do vertice 3: ");
while (isNaN(x)) {
  console.log("X não é número!");
  x = prompt("Digite o x do vertice 3: ");
}

y = prompt("Digite o y do vertice 3: ");
while (isNaN(y)) {
  console.log("Y não é número!");
  y = prompt("Digite o y do vertice 3: ");
}

const v3 = new Vertice(x, y);

//Chamando os métodos implementados na classe:
console.log(`\nVértice 1 - x: ${v1.x} / y: ${v1.y}`);
console.log(`Vértice 2 - x: ${v2.x} / y: ${v2.y}`);
console.log(`Vértice 3 - x: ${v3.x} / y: ${v3.y}`);
console.log(`\nDistancia entre v1 e v2: ${v1.distancia(v2)}`);
console.log(
  `Verificando se v1 e v3 sao iguais: ${v3.equals(v1) ? "Sim" : "Não"}`
);

console.log(`Mudando x e y de v1 para os de v2...`);
v1.move(v2.x, v2.y);

console.log(
  `Verificando se v1 e v2 sao iguais: ${v1.equals(v2) ? "Sim" : "Não"}`
);
