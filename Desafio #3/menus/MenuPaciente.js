//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

import { ConsultorioController } from "../controller/ConsultorioController.js";
import {
  validaNome,
  validaCPF,
  validaDtNasc,
} from "../components/ValidacoesEntrada.js";

export class MenuPaciente {
  #pacienteController;
  #prompt;
  constructor() {
    this.#prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C
    this.#pacienteController = new ConsultorioController();
  }

  //Sincroniza tabela de paciente
  async sync() {
    return await this.#pacienteController.syncPaciente();
  }

  // Imprime lista de pacientes
  async #imprimeListaPacientes(pacientes) {
    console.log("------------------------------------------------------------");
    console.log("CPF           Nome        Dt.Nasc.   Idade ");
    for (const paciente of pacientes) {
      console.log(
        `${paciente.cpf}  ${paciente.nome}  ${paciente.data_nascimento}  ${paciente.idade}`
      );
      if (paciente.data_agendamento !== null)
        console.log(
          `             Agendado para: ${paciente.data_agendamento}\n             ${paciente.inicio} às ${paciente.fim}`
        );
    }
    console.log("------------------------------------------------------------");
  }

  //Adicionar paciente
  async #addPaciente() {
    let entrada;
    let dadosPaciente = { cpf: "", nome: "", dataNasc: "" };
    let vrf = false;

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
    dadosPaciente.cpf = entrada;

    entrada = this.#prompt("Nome: ");
    //Validando nome
    vrf = validaNome(entrada);
    while (!vrf) {
      console.log("Tamanho do nome inválido (< 5 caracteres)");
      entrada = this.#prompt("Nome: ");
      vrf = validaNome(entrada);
    }
    dadosPaciente.nome = entrada;

    //Validando data de nascimento
    entrada = this.#prompt("Data de nascimento: ");
    //Validando nome
    vrf = validaDtNasc(entrada);
    while (typeof vrf === "number") {
      switch (vrf) {
        case 1:
          console.log("Data no formato incorreto!");
          break;
        case 2:
          console.log("Data inválida!");
          break;
        case 3:
          console.log("Idade não permitida!");
          break;
      }
      entrada = this.#prompt("Data de nascimento: ");
      vrf = validaDtNasc(entrada);
    }
    dadosPaciente.dataNasc = vrf; // Atribuindo ao vrf, pois ele retorna o objeto Date já com a data
    try {
      const pac = await this.#pacienteController.addPaciente(
        dadosPaciente.cpf,
        dadosPaciente.nome,
        dadosPaciente.dataNasc
      );
      if (pac === undefined)
        console.log("O paciente não foi cadastrado! Tente novamente!");
      else console.log("Paciente cadastrado!");
    } catch (erro) {
      console.log(
        `\n${
          !isNaN(erro.tipo)
            ? `${erro.msg}`
            : `${erro.campo ? `${erro.campo}: ` : ""}${erro.msg}`
        }\n`
      );
    }
    return;
  }

  //Remover paciente
  async #removePaciente() {
    let cpf = this.#prompt("CPF: ");

    let vrf = validaCPF(cpf);
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
      cpf = this.#prompt("CPF: ");
      vrf = validaCPF(cpf);
    }

    //Removendo paciente
    try {
      await this.#pacienteController.removePacienteByCPF(cpf);
      console.log("\nPaciente excluído com sucesso!\n");
    } catch (erro) {
      console.log(erro.msg);
    }
  }

  //Menu
  async menu() {
    let menuPac = true;
    while (menuPac) {
      console.log(
        "Menu do Cadastro de Pacientes\n1-Cadastrar novo paciente\n2-Excluir paciente\n3-Listar pacientes (ordenado por CPF)\n4-Listar pacientes (ordenado por nome)\n5-Voltar p/ menu principal"
      );

      let entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          await this.#addPaciente();
          break;
        case "2":
          await this.#removePaciente();
          break;
        case "3":
          let pacientesCPF =
            await this.#pacienteController.getPacientesOrderByCPF();
          this.#imprimeListaPacientes(pacientesCPF);
          break;
        case "4":
          let pacientesNome =
            await this.#pacienteController.getPacientesOrderByNome();
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
}
