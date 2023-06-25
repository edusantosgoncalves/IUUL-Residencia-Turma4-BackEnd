//Importando classes
import Triangulo from "./Triangulo.js";

//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Definindo regex da entrada dos vértices
const vrfEntrada = /^(\d+),(\d+),(\d+),(\d+),(\d+),(\d+)$/;

//Triangulo 1
console.log("---- TRIÂNGULOS ----");
let vertice = prompt(
  "Triângulo 1: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
);

while (!vrfEntrada.test(vertice)) {
  console.log("Vértices inseridos incorretamente!");
  vertice = prompt(
    "Triângulo 1: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
  );
}

let dadosVertice = vertice.split(",");
let triangulo1 = null;

try {
  triangulo1 = new Triangulo(
    dadosVertice[0],
    dadosVertice[1],
    dadosVertice[2],
    dadosVertice[3],
    dadosVertice[4],
    dadosVertice[5]
  );
} catch (e) {
  console.log(`${e}`);
}

//Triangulo 2
vertice = prompt(
  "Triângulo 2: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
);

while (!vrfEntrada.test(vertice)) {
  console.log("Vértices inseridos incorretamente!");
  vertice = prompt(
    "Triângulo 2: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
  );
}

dadosVertice = vertice.split(",");
triangulo2 = null;

try {
  triangulo2 = new Triangulo(
    dadosVertice[0],
    dadosVertice[1],
    dadosVertice[2],
    dadosVertice[3],
    dadosVertice[4],
    dadosVertice[5]
  );
} catch (e) {
  console.log(`${e}`);
}

//Triangulo 3
vertice = prompt(
  "Triângulo 3: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
);

while (!vrfEntrada.test(vertice)) {
  console.log("Vértices inseridos incorretamente!");
  vertice = prompt(
    "Triângulo 3: Insira os 3 vértices (x,y) no formato x1,y1,x2,y2,x3,y3: "
  );
}

dadosVertice = vertice.split(",");
let triangulo3 = null;

try {
  triangulo3 = new Triangulo(
    dadosVertice[0],
    dadosVertice[1],
    dadosVertice[2],
    dadosVertice[3],
    dadosVertice[4],
    dadosVertice[5]
  );
} catch (e) {
  console.log(`${e}`);
}

//Chamando os métodos implementados na classe:
if (triangulo1 !== null) {
  console.log(
    `\nTriângulo 1:\n - Vértice 1 - x: ${triangulo1.vertice1.x} / y: ${triangulo1.vertice1.y};`
  );
  console.log(
    ` - Vértice 2 - x: ${triangulo1.vertice2.x} / y: ${triangulo1.vertice2.y}`
  );
  console.log(
    ` - Vértice 3 - x: ${triangulo1.vertice3.x} / y: ${triangulo1.vertice1.y}`
  );
  console.log(` - Perimetro: ${triangulo1.perimetro}`);
  console.log(` - Tipo: ${triangulo1.tipo()}`);
  console.log(` - Área: ${triangulo1.area()}`);
}

if (triangulo2 !== null) {
  console.log(
    `\nTriângulo 2:\n - Vértice 1 - x: ${triangulo2.vertice1.x} / y: ${triangulo2.vertice1.y};`
  );
  console.log(
    ` - Vértice 2 - x: ${triangulo2.vertice2.x} / y: ${triangulo2.vertice2.y}`
  );
  console.log(
    ` - Vértice 3 - x: ${triangulo2.vertice3.x} / y: ${triangulo2.vertice1.y}`
  );
  console.log(` - Perimetro: ${triangulo2.perimetro}`);
  console.log(` - Tipo: ${triangulo2.tipo()}`);
  console.log(` - Área: ${triangulo2.area}`);
}

if (triangulo3 !== null) {
  console.log(
    `\nTriângulo 3:\n - Vértice 1 - x: ${triangulo3.vertice1.x} / y: ${triangulo3.vertice1.y};`
  );
  console.log(
    ` - Vértice 2 - x: ${triangulo3.vertice2.x} / y: ${triangulo3.vertice2.y}`
  );
  console.log(
    ` - Vértice 3 - x: ${triangulo3.vertice3.x} / y: ${triangulo3.vertice1.y}`
  );
  console.log(` - Perimetro: ${triangulo3.perimetro}`);
  console.log(` - Tipo: ${triangulo3.tipo()}`);
  console.log(` - Área: ${triangulo3.area}`);
}

//Clonando triangulo 2 se ele existir:
if (triangulo2 !== null) {
  let nvTriangulo = triangulo2.clone();
  console.log(
    `\nNovo triangulo (Cópia do 2):\n - Vértice 1 - x: ${nvTriangulo.vertice1.x} / y: ${nvTriangulo.vertice1.y};`
  );
  console.log(
    ` - Vértice 2 - x: ${nvTriangulo.vertice2.x} / y: ${nvTriangulo.vertice2.y}`
  );
  console.log(
    ` - Vértice 3 - x: ${nvTriangulo.vertice3.x} / y: ${nvTriangulo.vertice1.y}`
  );
  console.log(` - Perimetro: ${nvTriangulo.perimetro}`);
  console.log(` - Tipo: ${nvTriangulo.tipo()}`);
  console.log(` - Área: ${nvTriangulo.area}`);
}
