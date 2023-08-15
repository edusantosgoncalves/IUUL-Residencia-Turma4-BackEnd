//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Instanciando-a na variável prompt
//const prompt = this.#promptSync({ sigint: true }); // Permite terminar o programa com CTRL-C

//Importando o Controller do consultório
import { ConsultorioController } from "./controller/ConsultorioController.js";

export class Menu {
  #prompt;
  #consultorioController;
  constructor() {
    this.#prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C
    this.#consultorioController = new ConsultorioController();
  }

  //Sincronizando tabelas do consultório
  async sync() {
    return this.#consultorioController.sync();
  }

  //Imprimindo os agendamentos
  #imprimirAgendamentos(agenda) {
    let dataAnterior = null;
    console.log("------------------------------------------------------------");
    console.log("  Data   H.Ini  H.Fim  Tempo  Nome  Dt.Nasc. ");
    for (const agendamento of agenda) {
      console.log(
        `${
          agendamento.data === dataAnterior ? `          ` : agendamento.data
        }  ${agendamento.inicio}  ${agendamento.fim}  ${agendamento.tempo}  ${
          agendamento.nome_paciente
        } ${agendamento.data_nascimento_paciente} `
      );
      dataAnterior = agendamento.data;
    }
    console.log("------------------------------------------------------------");
  }

  async #imprimeListaPacientes(pacientes) {
    console.log("------------------------------------------------------------");
    console.log("CPF           Nome        Dt.Nasc.   Idade ");
    for (const paciente of pacientes) {
      console.log(
        `${paciente.cpf}  ${paciente.nome}  ${paciente.data_nascimento}  ${paciente.idade}`
      );
      if (paciente.data_agendamento !== null)
        console.log(
          `            Agendado para: ${paciente.data_agendamento}\n            ${paciente.inicio} às ${paciente.fim}`
        );
    }
    console.log("------------------------------------------------------------");
  }

  //Definindo funções do menu
  async #menuPacientes() {
    let menuPac = true;
    while (menuPac) {
      console.log(
        "Menu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal"
      );

      let entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          let dadosPaciente = { cpf: "", nome: "", dataNasc: "" };
          entrada = this.#prompt("CPF: ");
          dadosPaciente.cpf = entrada;

          entrada = this.#prompt("Nome: ");
          dadosPaciente.nome = entrada;

          entrada = this.#prompt("Data de nascimento: ");
          dadosPaciente.dataNasc = entrada;

          while (true) {
            try {
              await this.#consultorioController.addPaciente(
                dadosPaciente.cpf,
                dadosPaciente.nome,
                dadosPaciente.dataNasc
              );
              break;
            } catch (erro) {
              console.log(
                `\n${
                  !isNaN(erro.tipo)
                    ? `${erro.msg}`
                    : `${erro.campo ? `${erro.campo}: ` : ""}${erro.msg}`
                }\n`
              );
              switch (erro.campo) {
                case "nome":
                  entrada = this.#prompt("Nome: ");
                  dadosPaciente.nome = entrada;
                  break;
                case "data_nascimento":
                  entrada = this.#prompt("Data de nascimento: ");
                  dadosPaciente.dataNasc = entrada;
                  break;
                case "cpf":
                  entrada = this.#prompt("CPF: ");
                  dadosPaciente.cpf = entrada;
                  break;
                default:
                  return;
              }
            }
          }
          break;
        case "2":
          while (true) {
            try {
              entrada = this.#prompt("CPF: ");

              //Removendo paciente
              await this.#consultorioController.removePaciente(cpf);

              console.log("\nPaciente excluído com sucesso!\n");
              break;
            } catch (erro) {
              console.log(erro.msg);
              break;
            }
          }
          break;
        case "3":
          let pacientesCPF =
            await this.#consultorioController.getPacientesOrderByCPF();
          this.#imprimeListaPacientes(pacientesCPF);
          break;
        case "4":
          let pacientesNome =
            await this.#consultorioController.getPacientesOrderByNome();
          this.#imprimeListaPacientes(pacientesNome);
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

  async #menuAgenda() {
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
    let agendamento = null;
    let entrada;
    while (menuAg) {
      console.log(
        "Agenda\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal"
      );
      entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          paciente = null;
          while (paciente === null) {
            //Solicitando cpf do paciente
            entrada = this.#prompt("CPF: ");
            //Obtendo paciente
            try {
              paciente = await this.#consultorioController.getPacienteByCPF(
                entrada
              );
            } catch (e) {
              //Se houver erro ao obter o paciente, imprima-o e retorne ao menu
              console.log(e);
              return;
            }
            //Se não for obtido paciente, imprima a ocorrência e solicite novamente
            if (paciente === null)
              console.log("Erro: Paciente não encontrado!\n");
            //Se for obtido, atribua-o no atributo paciente do objeto dadosAgendamento
            else dadosAgendamento.paciente = paciente;
          }

          let agendamentoFut = null;
          try {
            //Verificando se o paciente tem agendamentos em aberto
            agendamentoFut =
              await this.#consultorioController.getAgendamentosFuturosByPaciente(
                dadosAgendamento.paciente
              );
          } catch (e) {
            //Se ocorrer algum erro ao obter o agendamento futuro, imprima-o e retorne ao menu
            console.log(e);
            return;
          }

          //Se for encontrado o agendamento, imprima a ocorrência e retorne ao menu
          if (agendamentoFut !== null) {
            console.log("O paciente possui um agendamento em aberto!");
            return;
          }

          //Obtendo dados para o agendamento
          entrada = this.#prompt("Data da consulta: ");
          dadosAgendamento.data = entrada;

          entrada = this.#prompt("Hora inicial: ");
          dadosAgendamento.horaIni = entrada;

          entrada = this.#prompt("Hora final: ");
          dadosAgendamento.horaFim = entrada;

          while (true) {
            try {
              agendamento =
                await this.#consultorioController.validaDadosAddAgendamento(
                  dadosAgendamento.paciente,
                  dadosAgendamento.data,
                  dadosAgendamento.horaIni,
                  dadosAgendamento.horaFim
                );
              break;
            } catch (erro) {
              console.log(
                `\n${
                  !isNaN(erro.tipo)
                    ? `${erro.msg}`
                    : `${erro.campo ? `${erro.campo}: ` : ""}${erro.msg}`
                }\n`
              );
              switch (erro.campo) {
                case "data":
                case "inicio":
                case "fim":
                  entrada = this.#prompt("Data da consulta: ");
                  dadosAgendamento.data = entrada;
                  entrada = this.#prompt("Hora inicial: ");
                  dadosAgendamento.horaIni = entrada;
                  entrada = this.#prompt("Hora final: ");
                  dadosAgendamento.horaFim = entrada;
                  break;
                default:
                  return;
              }
            }
          }

          //Verificando se há agendamentos no período informado
          let vrfAg;
          try {
            vrfAg = await this.#consultorioController.getAgendamentosIntervalo(
              agendamento
            );
          } catch (e) {
            console.log(
              "Erro ao verificar se há agendamentos no intervalo fornecido:",
              e
            );
          }

          if (vrfAg !== null) {
            console.log("Já existe um agendamento neste período!");
            return;
          }

          //Após a validação, insira o agendamento
          try {
            this.#consultorioController.agendaConsulta(agendamento);
          } catch (e) {
            console.log(e);
          }
          break;

        case "2":
          paciente = null;
          while (paciente === null) {
            //Solicitando cpf do paciente
            entrada = this.#prompt("CPF: ");
            //Obtendo paciente
            try {
              paciente = await this.#consultorioController.getPacienteByCPF(
                entrada
              );
            } catch (e) {
              //Se houver erro ao obter o paciente, imprima-o e retorne ao menu
              console.log(e);
              return;
            }
            //Se não for obtido paciente, imprima a ocorrência e solicite novamente
            if (paciente === null)
              console.log("Erro: Paciente não encontrado!\n");
            //Se for obtido, atribua-o no atributo paciente do objeto dadosAgendamento
            else dadosAgendamento.paciente = paciente;
          }

          //Obtendo dados para o agendamento
          entrada = this.#prompt("Data da consulta: ");
          dadosAgendamento.data = entrada;

          entrada = this.#prompt("Hora inicial: ");
          dadosAgendamento.horaIni = entrada;

          while (true) {
            try {
              agendamento =
                await this.#consultorioController.validaFormatoDadosCancelAgendamento(
                  dadosAgendamento.paciente,
                  dadosAgendamento.data,
                  dadosAgendamento.horaIni
                );
              break;
            } catch (erro) {
              console.log(
                `\n${
                  !isNaN(erro.tipo)
                    ? `${erro.msg}`
                    : `${erro.campo ? `${erro.campo}: ` : ""}${erro.msg}`
                }\n`
              );
              switch (erro.campo) {
                case "data":
                  entrada = this.#prompt("Data da consulta: ");
                  dadosAgendamento.data = entrada;
                  break;
                case "inicio":
                  entrada = this.#prompt("Hora inicial: ");
                  dadosAgendamento.horaIni = entrada;
                  break;
                case "fim":
                  entrada = this.#prompt("Hora final: ");
                  dadosAgendamento.horaFim = entrada;
                  break;
                default:
                  return;
              }
            }
          }

          while (true) {
            try {
              const vrf = await this.#consultorioController.cancelaAgendamento(
                dadosAgendamento.paciente,
                agendamento.inicio
              );
              console.log("O agendamento foi cancelado!");
              break;
            } catch (erro) {
              console.log(erro);
            }
          }
          break;
        case "3":
          entrada = this.#prompt("Apresentar a agenda T-Toda ou P-Período: ");
          while (entrada !== "P" && entrada !== "T") {
            entrada = this.#prompt(
              "Opção incorreta! Apresentar a agenda T-Toda ou P-Período: "
            );
          }
          let agenda;
          if (entrada === "T") {
            try {
              agenda =
                await this.#consultorioController.getAgendamentosFuturos();
            } catch (e) {
              console.log(e);
            }
          } else {
            entrada = this.#prompt("Data inicial: ");
            dadosAgendamento.dtInicio = entrada;
            entrada = this.#prompt("Data final: ");
            dadosAgendamento.dtFim = entrada;

            try {
              agenda = this.#consultorioController.listaAgenda(
                dadosAgendamento.dtInicio,
                dadosAgendamento.dtFim
              );
            } catch (e) {
              console.log(`\nErro: ${e.descErro ? e.descErro : e}\n`);
              switch (e.codErro) {
                case 1:
                  entrada = this.#prompt("Data inicial: ");
                  dadosAgendamento.dtInicio = entrada;
                  break;
                case 2:
                  entrada = this.#prompt("Data final: ");
                  dadosAgendamento.dtFim = entrada;
                  break;
              }
            }
          }

          this.#imprimirAgendamentos(agenda);
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

  async menu() {
    let menu = true;

    while (menu) {
      console.log(`Menu Principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim`);
      const entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          //Entrar no cadastro pacientes;
          await this.#menuPacientes();
          break;
        case "2":
          //Entrar agenda
          await this.#menuAgenda();
          break;
        case "3":
          menu = false;
          break;
        default:
          console.log("Opção incorreta!");
          break;
      }
    }
  }
}
