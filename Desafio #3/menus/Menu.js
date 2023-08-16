//Importando biblioteca PromptSync
import PromptSync from "prompt-sync";

//Importando menus
import { MenuPaciente } from "./MenuPaciente.js";
import { MenuAgendamento } from "./MenuAgendamento.js";

export class Menu {
  #prompt;
  #menuPacientes;
  #menuAgendamento;

  constructor() {
    this.#prompt = PromptSync({ sigint: true }); // Permite terminar o programa com CTRL-C
    this.#menuAgendamento = new MenuAgendamento();
    this.#menuPacientes = new MenuPaciente();
  }

  async sync() {
    //Sincronizando as 2 tabelas
    const pac = await this.#menuPacientes.sync();
    const ag = await this.#menuAgendamento.sync();
    const situacao = { msg: "", status: true };

    //Se houver retorno falso de alguma das sincronizações, ajuste o objeto retorno
    if (pac.status === false) {
      situacao.status = false;
      situacao.msg += `${pac.msg}\n`;
    }

    if (ag.status === false) {
      situacao.status = false;
      situacao.msg += `${ag.msg}\n`;
    }

    return situacao;
  }

  //Menu principal
  async menu() {
    let menu = true;

    while (menu) {
      console.log(`Menu Principal\n1-Cadastro de pacientes\n2-Agenda\n3-Fim`);
      const entrada = this.#prompt("");
      switch (entrada) {
        case "1":
          //Entrar no cadastro pacientes;
          await this.#menuPacientes.menu();
          break;
        case "2":
          //Entrar agenda
          await this.#menuAgendamento.menu();
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
