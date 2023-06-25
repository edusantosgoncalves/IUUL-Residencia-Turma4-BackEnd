class Aluno {
  constructor(nome, matricula) {
    this.nome = nome;
    this.matricula = matricula;
    this.p1 = null;
    this.p2 = null;
  }

  get media() {
    //Se não houver nenhuma nota, retorne 0
    if (this.p1 === null && this.p2 === null) {
      return 0;
    }
    //Se houver nota somente da p2, divida-a por 2
    if (this.p1 !== null && this.p2 === null) {
      return this.p1 / 2;
    }
    //Se houver nota somente da p2, divida-a por 2
    else if (this.p1 === null && this.p2 !== null) {
      return this.p2 / 2;
    }
    //Se houver as 2, some-as e divida por 2
    else {
      return (this.p1 + this.p2) / 2;
    }
  }
}

class Turma {
  constructor() {
    this._alunos = [];
  }

  inscreveAluno(nome, matricula) {
    //Verificando se o aluno existe
    for (aluno of this._alunos) {
      if (aluno.matricula === matricula) return false;
    }

    this._alunos.push(new Aluno())(nome, matricula);
    return true;
  }

  lancarNota(matricula, prova, nota) {
    let alunoEscolhido = null;

    //Buscar aluno pela matrícula, se encontrar, obtenha-o e saia do loop
    for (aluno of this._alunos) {
      if (aluno.matricula === matricula) {
        alunoEscolhido = aluno;
        break;
      }
    }

    //Se não encontrar o aluno, retorne falso
    if (alunoEscolhido === null) return false;

    //Se encontrar, verifique qual das 2 provas é e insira a nota
    if (prova === "p1") {
      alunoEscolhido.p1 = nota;
    } else if (prova === "p2") {
      alunoEscolhido.p2 = nota;
    } else {
      return false;
    }
  }

  removerAluno(matricula) {
    //Buscar aluno pela matrícula, se encontrar, remova-o e retorne verdadeiro
    for (aluno of this._alunos) {
      if (aluno.matricula === matricula) {
        this._alunos.pop(aluno);
        return true;
      }
    }

    //Se não encontrá-lo, retorne falso
    return false;
  }

  get diario() {
    console.log("—---------------------------------------");
    console.log("Matricula  Nome        P1   P2   NF");
    console.log("—---------------------------------------");
    //Iterando sobre os alunos da turma
    for (aluno of this._alunos) {
      console.log(
        `${aluno.matricula}  ${aluno.nome}        ${
          aluno.p1 !== null ? aluno.p1 : "-"
        }   ${aluno.p2 !== null ? aluno.p2 : "-"}   ${aluno.media.toFixed()}`
      );
    }

    console.log("—---------------------------------------");
  }
}

//Ler dados e notas e imprimir a lista de alunos - a fazer
