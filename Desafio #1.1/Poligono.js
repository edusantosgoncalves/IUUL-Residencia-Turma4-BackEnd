//Importando Vertice
import Vertice from "./Vertice.js";

export default class Poligono {
  constructor(vetorVertices) {
    //Se houver menos de 3 vértices, gere exceção
    if (vetorVertices.length < 3)
      throw new Error("É necessário que o poligono tenha ao menos 3 vértices!");

    let vertices = [];
    for (const vertice of vetorVertices) {
      vertices.push(new Vertice(vertice.x, vertice.y));
    }

    this._vertices = vertices;
  }

  addVertice(verticeAdd) {
    //Verificando se o vértice adicionado existe no poligono vértices
    for (const vertice of this._vertices) {
      //Se já existir, retorne falso
      if (vertice.x === verticeAdd.x && vertice.y === verticeAdd.y)
        return false;
    }

    //Se ele não existir, adicione-o e retorne verdadeiro
    this._vertices.push(new Vertice(verticeAdd.x, verticeAdd.y));
    return true;
  }

  get perimetro() {
    let perimetro = 0;
    let vertices = this._vertices;

    for (let i = 0; i < vertices.length; i++) {
      const iniVertice = vertices[i];
      const proxVertice = vertices[(i + 1) % vertices.length]; // Utilizando o % para garatir que o último vértice se ligue com o primeiro, fechando o polígno
      perimetro += iniVertice.distancia(proxVertice);
    }

    return perimetro;
  }

  get qtdVertices() {
    return this._vertices.length;
  }
}
