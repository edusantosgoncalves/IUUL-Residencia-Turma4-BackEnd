//Importando Vertice
import Vertice from "./Vertice.js";

export default class Poligono {
  constructor(vetorVertices) {
    //Se houver menos de 3 vértices, gere exceção
    if (vetorVertices.length < 3)
      throw new Error("É necessário que o poligono tenha ao menos 3 vértices!");

    vertices = [];
    for (const vertice in vetorVertices) {
      vertices.push(new Vertice(vertice.x, vertice.y));
    }

    this._vertices = vertices;
  }

  addVertice(verticeAdd) {
    //Verificando se o vértice adicionado existe no poligono vértices
    for (const vertice in this._vertices) {
      //Se já existir, retorne falso
      if (vertice.x === verticeAdd.x && vertice.y === verticeAdd.y)
        return false;
    }

    //Se ele não existir, adicione-o e retorne falso
    this._vertices = this._vertices.push(
      new Vertice(verticeAdd.x, verticeAdd.y)
    );
    return true;
  }

  get perimetro() {
    let perimetro = 0;

    //A implementar

    return perimetro;
  }

  get qtdVertices() {
    return this._vertices.length;
  }
}
