//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

import { ConsultorioController } from "../controller/ConsultorioController.js";

import {
  validaCPF,
  validaDataAgendamento,
  validaRegexHora,
  validaIntervaloHora,
  validaDataListarAgendamentos,
} from "../components/ValidacoesEntrada.js";

export class MenuAgendamento {
  #agendamentoController;
  #prompt;

  constructor() {
    this.#prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C
    this.#agendamentoController = new ConsultorioController();
  }

  //Sincronizando tabela de Agendamento
  async sync() {
    return await this.#agendamentoController.syncAgendamento();
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

  //Registrando atendimento
  async #addAgendamento() {
    let paciente = null;
    let vrf = null;
    let dadosAgendamento = {
      paciente: "",
      data: "",
      horaIni: "",
      horaFim: "",
      inicio: "",
      fim: "",
    };
    let entrada;
    while (paciente === null) {
      //Solicitando cpf do paciente
      entrada = this.#prompt("CPF: ");

      //Validando cpf
      vrf = validaCPF(entrada);
      while (vrf !== true) {
        switch (vrf) {
          case 1:
          case 2:
            console.log("O CPF inserido está no formato incorreto!\n");
            break;
          case 3:
            console.log("CPF inválido: Todos os dígitos são iguais!");
            break;
          case 4:
            console.log("CPF inválido: 1º dígito verificador inválido!");
            break;
          case 5:
            console.log("CPF inválido: 2º dígito verificador inválido!");
            break;
        }
        entrada = this.#prompt("CPF: ");
        vrf = validaCPF(entrada);
      }

      //Obtendo paciente
      try {
        paciente = await this.#agendamentoController.getPacienteByCPF(entrada);
      } catch (e) {
        //Se houver erro ao obter o paciente, imprima-o e retorne ao menu
        console.log(e);
        return;
      }

      //Se não for obtido paciente, imprima a ocorrência e retorne
      if (paciente === null) {
        console.log("Erro: Paciente não encontrado!\n");
      }
      //Se for obtido, atribua-o no atributo paciente do objeto dadosAgendamento
      else dadosAgendamento.paciente = paciente;
    }

    let agendamentoFut = null;
    try {
      //Verificando se o paciente tem agendamentos em aberto
      agendamentoFut =
        await this.#agendamentoController.getAgendamentosFuturosByPaciente(
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

    while (true) {
      //Obtendo dados para o agendamento
      entrada = this.#prompt("Data da consulta: ");

      //Validando data da consulta
      vrf = validaDataAgendamento(entrada);
      while (typeof vrf === "number") {
        switch (vrf) {
          case 1:
            console.log("Data no formato incorreto!");
            break;
          case 2:
            console.log("Data inválida!");
            break;
        }
        entrada = this.#prompt("Data da consulta: ");
        vrf = validaDataAgendamento(entrada);
      }
      dadosAgendamento.data = vrf; // Atribuindo ao vrf, pois ele retorna o objeto Date já com a data

      entrada = this.#prompt("Hora inicial: ");
      //Validando formato da hora inicial da consulta
      vrf = validaRegexHora(entrada);
      while (vrf === false) {
        console.log("Hora inicial no formato incorreto!");
        entrada = this.#prompt("Hora inicial: ");
        vrf = validaRegexHora(entrada);
      }
      dadosAgendamento.horaIni = entrada;

      entrada = this.#prompt("Hora final: ");
      //Validando formato da hora final da consulta
      vrf = validaRegexHora(entrada);
      while (vrf === false) {
        console.log("Hora final no formato incorreto!");
        entrada = this.#prompt("Hora final: ");
        vrf = validaRegexHora(entrada);
      }
      dadosAgendamento.horaFim = entrada;

      //Validando se o intervalo (data + horas) está no horário correto
      vrf = validaIntervaloHora(
        dadosAgendamento.data,
        dadosAgendamento.horaIni,
        dadosAgendamento.horaFim
      );

      if (typeof vrf !== "number") {
        dadosAgendamento.inicio = vrf.inicio;
        dadosAgendamento.fim = vrf.fim;
        break;
      } else {
        switch (vrf) {
          case 1:
            console.log("Hora inicial é posterior ao horário final!");
            break;
          case 2:
            console.log(
              "Tempo de consulta inválido (deve ser intervalo divisível a 15 minutos)!"
            );
            break;
          case 3:
            console.log("Horário não permitido (não está entre 8h-19h)!");
            break;
          case 4:
            console.log("Horário não permitido (já passou)!");
            break;
        }
      }
    }

    //Verificando se há agendamentos no período informado
    let vrfAg;
    try {
      vrfAg = await this.#agendamentoController.getAgendamentosIntervalo(
        dadosAgendamento.inicio,
        dadosAgendamento.fim
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
      const ag = await this.#agendamentoController.agendaConsulta(
        dadosAgendamento.paciente,
        dadosAgendamento.inicio,
        dadosAgendamento.fim
      );
      if (ag !== undefined) console.log("Agendamento realizado!");
      else console.log("Erro ao agendar consulta!");
    } catch (e) {
      console.log(e);
    }
  }

  //Cancelando agendamento
  async #cancelaAgendamento() {
    let paciente = null;
    let entrada;
    let dadosAgendamento = { paciente: "", data: "", horaIni: "", inicio: "" };
    let vrf;
    while (paciente === null) {
      //Solicitando cpf do paciente
      entrada = this.#prompt("CPF: ");

      //Validando cpf
      vrf = validaCPF(entrada);
      while (vrf !== true) {
        switch (vrf) {
          case 1:
          case 2:
            console.log("O CPF inserido está no formato incorreto!\n");
            break;
          case 3:
            console.log("CPF inválido: Todos os dígitos são iguais!");
            break;
          case 4:
            console.log("CPF inválido: 1º dígito verificador inválido!");
            break;
          case 5:
            console.log("CPF inválido: 2º dígito verificador inválido!");
            break;
        }
        entrada = this.#prompt("CPF: ");
        vrf = validaCPF(entrada);
      }

      //Obtendo paciente
      try {
        paciente = await this.#agendamentoController.getPacienteByCPF(entrada);
      } catch (e) {
        //Se houver erro ao obter o paciente, imprima-o e retorne ao menu
        console.log(e);
        return;
      }

      //Se não for obtido paciente, imprima a ocorrência e retorne
      if (paciente === null) {
        console.log("Erro: Paciente não encontrado!\n");
      }
      //Se for obtido, atribua-o no atributo paciente do objeto dadosAgendamento
      else dadosAgendamento.paciente = paciente;
    }

    //Obtendo dados para o agendamento
    entrada = this.#prompt("Data da consulta: ");

    //Validando data da consulta
    vrf = validaDataAgendamento(entrada);
    while (typeof vrf === "number") {
      switch (vrf) {
        case 1:
          console.log("Data no formato incorreto!");
          break;
        case 2:
          console.log("Data inválida!");
          break;
      }
      entrada = this.#prompt("Data da consulta: ");
      vrf = validaDataAgendamento(entrada);
    }
    dadosAgendamento.data = vrf; // Atribuindo ao vrf, pois ele retorna o objeto Date já com a data

    //Obtendo hora inicial da consulta
    entrada = this.#prompt("Hora inicial: ");
    //Validando formato da hora inicial da consulta
    vrf = validaRegexHora(entrada);
    while (vrf === false) {
      console.log("Hora inicial no formato incorreto!");
      entrada = this.#prompt("Hora inicial: ");
      vrf = validaRegexHora(entrada);
    }
    dadosAgendamento.horaIni = entrada;

    //Definindo o inicio do agendamento buscado
    dadosAgendamento.inicio = new Date(dadosAgendamento.data);
    dadosAgendamento.inicio.setHours(dadosAgendamento.horaIni.substring(0, 2));
    dadosAgendamento.inicio.setMinutes(dadosAgendamento.horaIni.substring(2));

    try {
      const ag = await this.#agendamentoController.cancelaAgendamento(
        dadosAgendamento.paciente,
        dadosAgendamento.inicio
      );
      if (typeof ag !== "number" || ag < 1)
        console.log("Agendamento não encontrado!");
      else console.log("O agendamento foi cancelado!");
    } catch (erro) {
      console.log(erro);
    }
  }

  //Listar agenda
  async #listaAgenda() {
    let dadosAgendamento = { dtInicio: "", dtFim: "" };
    let vrf;

    let entrada = this.#prompt("Apresentar a agenda T-Toda ou P-Período: ");
    while (entrada !== "P" && entrada !== "T") {
      entrada = this.#prompt(
        "Opção incorreta! Apresentar a agenda T-Toda ou P-Período: "
      );
    }

    let agenda;

    if (entrada === "T") {
      try {
        agenda = await this.#agendamentoController.getAgendamentos();
      } catch (e) {
        console.log(e);
      }
    } else {
      //Obtendo data inicial
      entrada = this.#prompt("Data inicial: ");
      //Validando data inicial da consulta
      vrf = validaDataListarAgendamentos(entrada);
      while (vrf === false) {
        console.log("Data no formato incorreto!");
        entrada = this.#prompt("Data inicial: ");
        vrf = validaDataListarAgendamentos(entrada);
      }
      dadosAgendamento.dtInicio = vrf;

      //Obtendo data final
      entrada = this.#prompt("Data final: ");
      //Validando data final da consulta
      vrf = validaDataListarAgendamentos(entrada);
      while (vrf === false) {
        console.log("Data no formato incorreto!");
        entrada = this.#prompt("Data final: ");
        vrf = validaDataListarAgendamentos(entrada);
      }
      dadosAgendamento.dtFim = vrf;
      dadosAgendamento.dtFim.setHours(23);
      dadosAgendamento.dtFim.setMinutes(59);

      try {
        agenda = await this.#agendamentoController.getAgendamentos(
          dadosAgendamento.dtInicio,
          dadosAgendamento.dtFim
        );
      } catch (e) {
        console.log(`\nErro ao obter agenda:\n`, e);
        return;
      }
    }
    this.#imprimirAgendamentos(agenda);
  }

  //Menu
  async menu() {
    let menuAg = true;
    let entrada;
    while (menuAg) {
      console.log(
        "Agenda\n1-Agendar consulta\n2-Cancelar agendamento\n3-Listar agenda\n4-Voltar p/ menu principal"
      );
      entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          await this.#addAgendamento();
          break;
        case "2":
          await this.#cancelaAgendamento();
          break;
        case "3":
          await this.#listaAgenda();
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
}
