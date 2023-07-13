//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Importando classes
import Consultorio from "./Consultorio.js";

//Instanciando-a na variável prompt
const prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Declarando variável que receberá as entradas via console
let entrada;

//Instanciando Consultorio
const consultorio = new Consultorio();

//Testes (para deixar já incluídos na "base") - addPacientes
consultorio.addPaciente("46531583045", "Eduardo Santos", "29/08/2000");
consultorio.addPaciente("86759561856", "Adriana", "09/03/1983");
try {
  consultorio.addPaciente("53448377988", "Isabella", "08/07/2015");
} catch (e) {
  console.log(`\nErro: ${e.descErro}\n`);
}
consultorio.addPaciente("98411048063", "Ericson", "15/05/1974");

//Testes agendaConsulta
let pac = consultorio.buscaPaciente("46531583045");
try {
  consultorio.agendaConsulta(pac, "13/07/2023", "0900", "0930");
} catch (e) {
  console.log(`\nErro: ${e.descErro}\n`);
}

pac = consultorio.buscaPaciente("86759561856");
consultorio.agendaConsulta(pac, "15/07/2023", "1200", "1215");
pac = consultorio.buscaPaciente("98411048063");
consultorio.agendaConsulta(pac, "14/07/2023", "1100", "1145");

pac = consultorio.buscaPaciente("46531583045");
try {
  consultorio.agendaConsulta(pac, "15/07/2023", "1200", "1215");
} catch (e) {
  console.log(`\nErro: ${e.descErro}\n`);
}
try {
  consultorio.agendaConsulta(pac, "15/07/2023", "1145", "1230");
} catch (e) {
  console.log(`\nErro: ${e.descErro}\n`);
}
try {
  consultorio.agendaConsulta(pac, "15/07/2023", "1215", "1230");
} catch (e) {
  console.log(`\nErro: ${e.descErro}\n`);
}

//Definindo funções do menu
async function menuPacientes() {
  let menuPac = true;
  while (menuPac) {
    console.log(
      "Menu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal"
    );

    entrada = prompt("");
    switch (entrada) {
      case "1":
        let dadosPaciente = { cpf: "", nome: "", dataNasc: "" };
        entrada = prompt("CPF: ");
        dadosPaciente.cpf = entrada;

        entrada = prompt("Nome: ");
        dadosPaciente.nome = entrada;

        entrada = prompt("Data de nascimento: ");
        dadosPaciente.dataNasc = entrada;

        while (true) {
          try {
            consultorio.addPaciente(
              dadosPaciente.cpf,
              dadosPaciente.nome,
              dadosPaciente.dataNasc
            );
            break;
          } catch (erro) {
            console.log(`\nErro: ${erro.descErro ? erro.descErro : erro}\n`);
            switch (erro.codErro) {
              case 1:
                entrada = prompt("Nome: ");
                dadosPaciente.nome = entrada;
                break;
              case 2:
                entrada = prompt("Data de nascimento: ");
                dadosPaciente.dataNasc = entrada;
                break;
              case 3:
                entrada = prompt("Data de nascimento: ");
                dadosPaciente.dataNasc = entrada;
                break;
              case 4:
                return;
              case 5:
                entrada = prompt("CPF: ");
                dadosPaciente.cpf = entrada;
                break;
              default:
                break;
            }
          }
        }
        break;
      case "2":
        while (true) {
          try {
            entrada = prompt("CPF: ");
            consultorio.removePaciente(entrada);
            console.log("\nPaciente excluído com sucesso!\n");
            break;
          } catch (erro) {
            console.log(`\nErro: ${erro.descErro ? erro.descErro : erro}\n`);
          }
        }
        break;
      case "3":
        consultorio.listaPacientesOrderByCPF;
        break;
      case "4":
        consultorio.listaPacientesOrderByNome;
        break;
      case "5":
        menuPac = false;
        break;
      default:
        console.log("Opção incorreta!");
        break;
    }
  }
}

async function menuAgenda() {
  let menuAg = true;
  let dadosAgendamento = {
    paciente: "",
    data: "",
    horaIni: "",
    horaFim: "",
    //Para listar agenda:
    dtInicio: "",
    dtFim: "",
  };
  let paciente = undefined;

  while (menuAg) {
    console.log(
      "Agenda\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal"
    );
    entrada = prompt("");
    switch (entrada) {
      case "1":
        paciente = undefined;
        while (paciente === undefined) {
          entrada = prompt("CPF: ");
          paciente = consultorio.buscaPaciente(entrada);
          if (paciente === undefined)
            console.log("Erro: Paciente não encontrado!");
          else dadosAgendamento.paciente = paciente;
        }

        entrada = prompt("Data da consulta: ");
        dadosAgendamento.data = entrada;

        entrada = prompt("Hora inicial: ");
        dadosAgendamento.horaIni = entrada;

        entrada = prompt("Hora final: ");
        dadosAgendamento.horaFim = entrada;

        while (true) {
          try {
            consultorio.agendaConsulta(
              dadosAgendamento.paciente,
              dadosAgendamento.data,
              dadosAgendamento.horaIni,
              dadosAgendamento.horaFim
            );
            break;
          } catch (erro) {
            console.log(`\nErro: ${erro.descErro ? erro.descErro : erro}\n`);
            switch (erro.codErro) {
              case 1:
                entrada = prompt("Data da consulta: ");
                dadosAgendamento.data = entrada;
                break;
              case 2:
                entrada = prompt("Data da consulta: ");
                dadosAgendamento.data = entrada;
                break;
              case 3.1:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                break;
              case 3.2:
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              case 4:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              case 5:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              case 6:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              case 7:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              case 8:
                return;
              case 9:
                entrada = prompt("Data da consulta: ");
                dadosAgendamento.data = entrada;
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                entrada = prompt("Hora final: ");
                dadosAgendamento.horaFim = entrada;
                break;
              default:
                return;
            }
          }
        }
        break;
      case "2":
        paciente = undefined;

        while (paciente === undefined) {
          entrada = prompt("CPF: ");
          paciente = consultorio.buscaPaciente(entrada);
          if (paciente === undefined)
            console.log("Erro: Paciente não encontrado!");
          else dadosAgendamento.paciente = paciente;
        }

        entrada = prompt("Data da consulta: ");
        dadosAgendamento.data = entrada;

        entrada = prompt("Hora inicial: ");
        dadosAgendamento.horaIni = entrada;

        while (true) {
          try {
            consultorio.cancelaAgendamento(
              dadosAgendamento.paciente,
              dadosAgendamento.data,
              dadosAgendamento.horaIni
            );
            console.log("Agendamento cancelado com sucesso!");
            break;
          } catch (erro) {
            console.log(`\nErro: ${erro.descErro ? erro.descErro : erro}\n`);
            switch (erro.codErro) {
              case 1:
                entrada = prompt("Data da consulta: ");
                dadosAgendamento.data = entrada;
                break;
              case 2:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                break;
              case 3:
                entrada = prompt("Data da consulta: ");
                dadosAgendamento.data = entrada;
                break;
              case 4:
                entrada = prompt("Hora inicial: ");
                dadosAgendamento.horaIni = entrada;
                break;
              default:
                return;
            }
          }
        }
        break;
      case "3":
        entrada = prompt("Apresentar a agenda T-Toda ou P-Período: ");
        while (entrada !== "P" && entrada !== "T") {
          entrada = prompt(
            "Opção incorreta! Apresentar a agenda T-Toda ou P-Período: "
          );
        }
        if (entrada === "T") {
          consultorio.listaAgenda();
        } else {
          entrada = prompt("Data inicial: ");
          dadosAgendamento.dtInicio = entrada;
          entrada = prompt("Data final: ");
          dadosAgendamento.dtFim = entrada;

          try {
            consultorio.listaAgenda(
              dadosAgendamento.dtInicio,
              dadosAgendamento.dtFim
            );
          } catch (e) {
            console.log(`\nErro: ${e.descErro ? e.descErro : e}\n`);
            switch (e.codErro) {
              case 1:
                entrada = prompt("Data inicial: ");
                dadosAgendamento.dtInicio = entrada;
                break;
              case 2:
                entrada = prompt("Data final: ");
                dadosAgendamento.dtFim = entrada;
                break;
            }
          }
        }
        break;
      case "4":
        menuAg = false;
        break;
      default:
        console.log("Opção incorreta!");
        break;
    }
  }
}

let menu = true;

while (menu) {
  console.log(`Menu Principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim`);
  entrada = prompt("");
  switch (entrada) {
    case "1":
      //Entrar no cadastro pacientes;
      await menuPacientes();
      break;
    case "2":
      //Entrar agenda
      await menuAgenda();
      break;
    case "3":
      menu = false;
      break;
    default:
      console.log("Opção incorreta!");
      break;
  }
}
