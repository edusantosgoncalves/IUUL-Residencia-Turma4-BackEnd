export default class Vertice {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  //Método para calcular a distância euclidiana de um vértice a outro
  distancia(outroVertice) {
    const dx = outroVertice.x - this._x;
    const dy = outroVertice.y - this._y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  //Método para mover o vértice para outra posição (x,y).
  move(x, y) {
    this._x = x;
    this._y = y;
  }

  //Método para verificar se 2 vértices são iguais
  equals(outroVertice) {
    return this._x === outroVertice.x && this._y === outroVertice.y;
  }
}
