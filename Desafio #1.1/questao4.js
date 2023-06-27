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
    for (const aluno of this._alunos) {
      if (aluno.matricula === matricula) return false;
    }

    this._alunos.push(new Aluno(nome, matricula));
    return true;
  }

  lancarNota(matricula, prova, nota) {
    //Verificando se a prova ou a nota estão corretas
    if (prova !== "P1" && prova !== "p1" && prova !== "P2" && prova !== "p2")
      return "Prova incorreta!";

    if (nota < 0 || nota > 10) return "Nota inválida!";

    //Buscar aluno pela matrícula, se encontrar, obtenha-o e saia do loop
    let alunoEscolhido = null;
    for (const aluno of this._alunos) {
      if (aluno.matricula === matricula) {
        alunoEscolhido = aluno;
        break;
      }
    }

    //Se não encontrar o aluno, retorne falso
    if (alunoEscolhido === null) return "Aluno não encontrado";

    //Se encontrar, verifique qual das 2 provas é e insira a nota
    if (prova === "p1" || prova === "P1") {
      alunoEscolhido.p1 = parseInt(nota);
      return "Nota da P1 adicionada!"; // Verdadeiro
    } else {
      alunoEscolhido.p2 = parseInt(nota);
      return "Nota da P2 adicionada";
    }
  }

  removerAluno(matricula) {
    //Buscar aluno pela matrícula, se encontrar, remova-o e retorne verdadeiro
    for (const aluno of this._alunos) {
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
    for (const aluno of this._alunos) {
      console.log(
        `${aluno.matricula}  ${aluno.nome}        ${
          aluno.p1 !== null ? aluno.p1.toFixed(2) : "-"
        }   ${
          aluno.p2 !== null ? aluno.p2.toFixed(2) : "-"
        }   ${aluno.media.toFixed(2)}`
      );
    }

    console.log("—---------------------------------------");
  }
}

//Ler dados e notas e imprimir a lista de alunos

//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C
let entrada;
let turma = new Turma();

//Funções para o menu
function menu1() {
  entrada = prompt(
    "Insira o nome e matricula do aluno no formato matricula,nome: "
  );

  let alunoIns = entrada.split(",");
  while (alunoIns.length != 2 || isNaN(alunoIns[0])) {
    entrada = prompt(
      "INCORRETO! Insira o nome e matricula do aluno no formato matricula,nome: "
    );

    alunoIns = entrada.split(",");
  }
  console.log(
    turma.inscreveAluno(alunoIns[1].trim(), alunoIns[0].trim())
      ? "Aluno inscrito!"
      : "Aluno já inscrito!"
  );
}

function menu2() {
  entrada = prompt("Insira a matrícula do aluno: ");

  while (isNaN(entrada)) {
    entrada = prompt("INCORRETO! Insira a matrícula do aluno: ");
  }

  console.log(
    turma.removerAluno(entrada.trim())
      ? "Aluno removido!"
      : "Aluno não encontrado!"
  );
}

function menu3() {
  entrada = prompt(
    "Insira a matrícula do aluno, prova e nota no formato matricula,prova,nota: "
  );

  let alunoNota = entrada.split(",");

  while (
    alunoNota.length < 3 ||
    isNaN(
      alunoNota[0] ||
        isNaN(alunoNota[2]) ||
        (alunoNota[1] !== "p1" &&
          alunoNota[1] !== "P1" &&
          alunoNota[1] !== "p2" &&
          alunoNota[1] !== "P2")
    )
  ) {
    entrada = prompt(
      "Insira a matrícula do aluno, prova e nota no formato matricula,prova,nota: "
    );
    alunoNota = entrada.split(",");
  }

  console.log(
    turma.lancarNota(
      alunoNota[0].trim(),
      alunoNota[1].trim(),
      alunoNota[2].trim()
    )
  );
}

function menu4() {
  console.log("\n");
  turma.diario;
  console.log("\n");
}

//Abrindo menu
let vrfMenu = true;
while (vrfMenu) {
  console.log("\n---- TURMA ----");
  console.log("1 - Inscrever aluno");
  console.log("2 - Remover aluno");
  console.log("3 - Lançar nota");
  console.log("4 - Imprimir diario");
  console.log("5 - Sair\n");
  entrada = prompt("Para onde deseja ir? ");

  switch (entrada.trim()) {
    case "1":
      menu1();
      break;
    case "2":
      menu2();
      break;
    case "3":
      menu3();
      break;
    case "4":
      menu4();
      break;
    case "5":
      vrfMenu = false;
      break;
    default:
      console.log("OPÇÃO INCORRETA!\n");
      break;
  }
}
