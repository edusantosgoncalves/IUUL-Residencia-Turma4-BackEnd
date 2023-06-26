//Importando Vertice
import Vertice from "./Vertice.js";

export default class Triangulo {
  constructor(x1, x2, x3, y1, y2, y3) {
    if (!this._isTriangulo(x1, x2, x3, y1, y2, y3)) {
      throw new Error("Os vértices não formam um triângulo válido.");
    }

    this._vertice1 = new Vertice(x1, y1);
    this._vertice2 = new Vertice(x2, y2);
    this._vertice3 = new Vertice(x3, y3);
  }

  _isTriangulo(x1, x2, x3, y1, y2, y3) {
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x3 - x1;
    const dy2 = y3 - y1;

    return dx1 * dy2 !== dx2 * dy1;
  }

  get vertice1() {
    return this._vertice1;
  }

  get vertice2() {
    return this._vertice2;
  }

  get vertice3() {
    return this._vertice3;
  }

  equals(outroTriangulo) {
    return (
      this._vertice1.x === outroTriangulo.vertice1.x &&
      this._vertice1.y === outroTriangulo.vertice1.y &&
      this._vertice2.x === outroTriangulo.vertice2.x &&
      this._vertice2.y === outroTriangulo.vertice2.y &&
      this._vertice3.x === outroTriangulo.vertice3.x &&
      this._vertice3.y === outroTriangulo.vertice3.y
    );
  }

  get perimetro() {
    const distancia1 = this._vertice1.distancia(this._vertice2);
    const distancia2 = this._vertice2.distancia(this._vertice3);
    const distancia3 = this._vertice3.distancia(this._vertice1);
    return distancia1 + distancia2 + distancia3;
  }

  tipo() {
    const distancia1 = this._vertice1.distancia(this._vertice2);
    const distancia2 = this._vertice2.distancia(this._vertice3);
    const distancia3 = this._vertice3.distancia(this._vertice1);

    if (distancia1 === distancia2 && distancia2 === distancia3) {
      return "Equilátero";
    } else if (
      distancia1 === distancia2 ||
      distancia1 === distancia3 ||
      distancia2 === distancia3
    ) {
      return "Isósceles";
    } else {
      return "Escaleno";
    }
  }

  clone() {
    return new Triangulo(
      this.vertice1.x,
      this.vertice2.x,
      this.vertice3.x,
      this.vertice1.y,
      this.vertice2.y,
      this.vertice3.y
    );
  }

  get area() {
    const a = this._vertice1.distancia(this._vertice2);
    const b = this._vertice2.distancia(this._vertice3);
    const c = this._vertice3.distancia(this._vertice1);
    const S = this.perimetro / 2;

    return Math.sqrt(S * (S - a) * (S - b) * (S - c));
  }
}
