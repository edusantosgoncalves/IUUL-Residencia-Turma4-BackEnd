//Importando Paciente
import Paciente from "./Paciente";
import Agendamento from "./Agendamento";

export default class Consultorio {
  constructor() {
    this.#pacientes = [];
    this.#agenda = [];
  }

  buscaPaciente(cpf) {
    return this.#pacientes.find((paciente) => paciente.cpf === cpf);
  }

  addPaciente(cpf, nome, dtNasc) {
    try {
      //Verificar se existe paciente
      if (this.buscaPaciente(cpf) !== null) throw "Cliente já registrado!";

      const novoPaciente = new Paciente(cpf, nome, dtNasc);

      this.#pacientes.push(novoPaciente);
    } catch (e) {
      return e;
    }
  }

  removePaciente(cpf) {
    //Buscar se o paciente existe
    const pacienteBuscado = buscaPaciente(cpf);
    if (pacienteBuscado === null) return false;

    //Buscar se o paciente tem alguma consulta agendada futura
    if (this.#verificaFuturoAgendamento(cpf) !== null) return false;

    //Se não tiver, removendo os agendamentos passados
    this.#removeAgendamentos(cpf);

    //Após, removendo o paciente
    this.#pacientes = this.#pacientes.filter(
      (paciente) => paciente.cpf !== cpf
    );
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

  get listaPacientesOrderByNome() {
    //Ordenando os pacientes por cpf
    this.#pacientes.sort((paciente1, paciente2) => {
      return paciente1.cpf.localeCompare(paciente2.cpf);
    });

    //Imprimindo a lista
    this.#imprimirPacientes();

    /*//Ordenando a agenda por cpf
    const agendaOrdenada = { ...this.#agenda };
    agendaOrdenada.sort((agendamento1, agendamento2) => {
      return agendamento1.cpfPaciente.localeCompare(agendamento2.cpfPaciente);
    });

    //Imprimir a agendaOrdenada
    console.log
    for (const agendamento of agendaOrdenada) {
      
    }

    console.log("------------------------------------------------------------");*/
  }

  #verificaFuturoAgendamento(cpf) {
    //Verificar se há futuros agendamentos
    return this.#agenda.find(
      (agendamento) =>
        agendamento.cpfPaciente === cpf && agendamento.data > new Date()
    );
  }

  agendaConsulta(cpf, data, horaIni, horaFim) {
    //Verifica se o paciente existe
    const paciente = this.buscaPaciente(cpf);
    if (paciente === null)
      throw { codErro: 8, descErro: "Paciente não encontrado!" };

    //Verifica se há agendamentos futuros
    if (this.#verificaFuturoAgendamento(cpf) !== null)
      throw {
        codErro: 9,
        descErro: "Já existe um agendamento futuro para este paciente!",
      };

    //Verificar se há agendamento no período fornecido
    if (this.#verificaAgendamentoPeriodo(horaIni, horaFim))
      throw {
        codErro: 10,
        descErro: "Já existe um agendamento neste horário!",
      };

    //Se não houver, tente criar o agendamento
    //try {
    const novoAgendamento = new Agendamento(data, horaIni, horaFim, paciente);
    this.#agenda.push(novoAgendamento);

    //return true;
    //} catch (erro) {
    //return erro;
    //}
  }

  cancelaAgendamento(cpf, data, horaIni) {
    //Criando instância Date para comparar as datas
    const dataSplit = data.split("/");
    const dt = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

    //Validando se a data é anterior que a atual
    const dataAtual = new Date();
    if (dataAtual > dt) throw { codErro: 1, descErro: "Data inválida!" };

    const hrIni = new Date();
    hrIni.setHours(Number(horaIni.substring(0, 2)));
    hrIni.setMinutes(Number(horaIni.substring(2)));

    if (dataAtual === dt && hrIni < horaAtual)
      throw { codErro: 2, descErro: "Hora fora do permitido!" };

    const qtdAgendamentosAntes = this.#agenda.length;

    this.#agenda = this.#agenda.filter(
      (agendamento) =>
        agendamento.cpfPaciente !== cpf && agendamento.data >= dataAtual
    );
  }

  get listaAgenda() {
    //Ordenar lista por data de agendamento
    this.#removeAgendamentos.sort((agendamento1, agendamento2) => {
      const dia1 = agendamento1.dia;
      const mes1 = agendamento1.mes;
      const ano1 = agendamento1.ano;

      const dia2 = agendamento2.dia;
      const mes2 = agendamento2.mes;
      const ano2 = agendamento2.ano;

      return ano1 === ano2 && mes1 === mes2 && dia1 === dia2 ? 0 : 1;
    });
  }

  #removeAgendamentos(cpf) {
    this.#agenda = this.#agenda.filter(
      (agendamento) => agendamento.cpfPaciente === cpf
    );
  }

  #verificaAgendamentoPeriodo(horaIni, horaFim) {
    const hrIni = new Date();
    hrIni.setHours(Number(horaIni.substring(0, 2)));
    hrIni.setMinutes(Number(horaIni.substring(2)));

    const hrFim = new Date();
    hrFim.setHours(Number(horaFim.substring(0, 2)));
    hrFim.setMinutes(Number(horaFim.substring(2)));

    return this.#agenda.find(
      (agendamento) =>
        (hrIni >= agendamento.horaInicial && hrIni < agendamento.horaFinal) ||
        (hrFim > agendamento.horaInicial && hrFim <= agendamento.horaFinal) ||
        (hrIni <= agendamento.horaInicial && hrFim >= agendamento.horaFinal)
    );
  }

  #imprimirPacientes() {
    ("------------------------------------------------------------");
    console.log("CPF    Nome        Dt.Nasc.   Idade ");
    for (const paciente of this.#pacientes) {
      console.log(
        `${paciente.cpf}  ${paciente.nome}  ${agendamento.dtNasc}  ${agendamento.idade}`
      );
    }
    ("------------------------------------------------------------");
  }

  #imprimirAgendamentos() {
    //Ajustar...
    ("------------------------------------------------------------");
    console.log("  Data   H.Ini  H.Fim  Tempo  Nome  Dt.Nasc. ");
    for (const agendamento of this.#agenda) {
      console.log(
        `${agendamento.data}  ${agendamento.horaIni}  ${agendamento.horaFim}  ${agendamento.tempo}  ${agendamento.nomePaciente} ${agendamento.dtNascPaciente} `
      );
    }
    ("------------------------------------------------------------");
  }
}
