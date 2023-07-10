//Importando Paciente
import Paciente from "./Paciente";

export default class Consultorio {
  constructor() {
    this.#pacientes = [];
    this.#agenda = [];
  }

  addPaciente(cpf, nome, dtNasc) {
    try {
      const novoPaciente = new Paciente(cpf, nome, dtNasc);
      this.#pacientes.push(novoPaciente);
    } catch (e) {
      return e;
    }
  }

  buscaPaciente(cpf) {
    return pacientes.find((paciente) => paciente.cpf === cpf);
  }

  removePaciente(cpf) {
    const pacienteBuscado = buscaPaciente(cpf);

    if (pacienteBuscado === null) return false;

    //Buscar se o paciente tem alguma consulta agendada futura

    //Se não tiver, remover os agendamentos passados se houver e após, removê-lo
  }

  get listaPacientesOrderByCPF() {
    const listaOrderCPF = this.#pacientes.sort((paciente1, paciente2) => {
      const cpfP1 = parseInt(paciente1.cpf);
      const cpfP2 = parseInt(paciente2.cpf);

      if (cpfP1 < cpfP2) {
        return -1;
      } else if (cpfP1 > cpfP2) {
        return 1;
      } else {
        return 0;
      }
    });

    //Imprimir lista no padrão
  }

  listaPacientesOrderByNome() {}

  verificaFuturoAgendamento(cpf) {
    //Verificar se há futuros agendamentos
  }
  agendaConsulta() {
    //Verifica se há agendamentos futuros
  }

  cancelaAgendamento() {}

  get listaAgenda() {
    //Ordenar lista por data de agendamento
  }
}
