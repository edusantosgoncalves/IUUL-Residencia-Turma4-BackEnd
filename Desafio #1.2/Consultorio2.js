//Importando Paciente
import Paciente from "./Paciente.js";
import Agendamento2 from "./Agendamento2.js";
import { validaRegexData, validaRegexHora, validaCPF } from "./Validacoes.js";

export default class Consultorio {
  #pacientes = [];
  #agenda = [];
  constructor() {}

  buscaPaciente(cpf) {
    return this.#pacientes.find((paciente) => paciente.cpf === cpf);
  }

  addPaciente(cpf, nome, dtNasc) {
    try {
      const existeCPF = this.buscaPaciente(cpf);

      //Verificar se existe paciente
      if (existeCPF !== undefined)
        throw { codErro: 6, descErro: "Cliente já registrado!" };

      const novoPaciente = new Paciente(cpf, nome, dtNasc);

      this.#pacientes.push(novoPaciente);
    } catch (e) {
      throw e;
    }
  }

  removePaciente(cpf) {
    //Buscar se o paciente existe
    const pacienteBuscado = this.buscaPaciente(cpf);
    if (pacienteBuscado === undefined)
      throw { codErro: 1, descErro: "Paciente não cadastrado!" };

    //Buscar se o paciente tem alguma consulta agendada futura
    if (this.#buscaFuturoAgendamento(cpf) !== undefined)
      throw { codErro: 2, descErro: "Paciente com consulta futura agendada!" };

    //Se não tiver, removendo os seus agendamentos
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
    this.#imprimirPacientes();
  }

  get listaPacientesOrderByNome() {
    //Ordenando os pacientes por cpf
    this.#pacientes.sort((paciente1, paciente2) => {
      return paciente1.nome.localeCompare(paciente2.nome);
    });

    //Imprimindo a lista
    this.#imprimirPacientes();
  }

  #buscaFuturoAgendamento(cpf) {
    //Verificar se há futuros agendamentos
    return this.#agenda.find(
      (agendamento) =>
        agendamento.cpfPaciente === cpf && agendamento.inicio > new Date()
    );
  }

  agendaConsulta(paciente, data, horaIni, horaFim) {
    //Verifica se o paciente existe
    //const paciente = this.buscaPaciente(cpf);
    //if (paciente === undefined)
    //throw { codErro: 8, descErro: "Paciente não encontrado!" };

    //Verifica se há agendamentos futuros
    if (this.#buscaFuturoAgendamento(paciente.cpf) !== undefined)
      throw {
        codErro: 8,
        descErro: "Já existe um agendamento futuro para este paciente!",
      };

    //Verificar se há agendamento no período fornecido
    if (this.#verificaAgendamentoPeriodo(horaIni, horaFim))
      throw {
        codErro: 9,
        descErro: "Já existe um agendamento neste horário!",
      };

    //Se não houver, tente criar o agendamento
    //try {
    const novoAgendamento = new Agendamento2(data, horaIni, horaFim, paciente);
    this.#agenda.push(novoAgendamento);

    //return true;
    //} catch (erro) {
    //return erro;
    //}
  }

  cancelaAgendamento(paciente, data, horaIni) {
    //Validar se o CPF está no formato
    //if (!validaCPF(cpf)) throw { codErro: 0, descErro: "CPF inválido!" };

    //Validar se data está no formato
    if (!validaRegexData(data))
      throw { codErro: 1, descErro: "Data em formato incorreto!" };

    //Validar se hora está no formato
    if (!validaRegexHora(horaIni))
      throw { codErro: 2, descErro: "Hora inicial em formato incorreto!" };

    //Criando instância Date para comparar as datas
    const dataSplit = data.split("/");
    const dt = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
    dt.setHours(0);
    dt.setMinutes(0);

    //Validando se a data é anterior que a atual
    let dataAtual = new Date();
    dataAtual.setHours(0);
    dataAtual.setMinutes(0);

    if (dataAtual > dt) throw { codErro: 3, descErro: "Data inválida!" };

    dataAtual = new Date();
    dt.setHours(Number(horaIni.substring(0, 2)));
    dt.setMinutes(Number(horaIni.substring(2)));

    if (dataAtual > dt)
      // if (dataAtual === dt && hrIni < horaAtual)
      throw { codErro: 4, descErro: "Hora fora do permitido!" };

    const qtdAgendamentosAntes = this.#agenda.length;

    this.#agenda = this.#agenda.filter(
      (agendamento) =>
        agendamento.cpfPaciente !== paciente.cpf &&
        agendamento.data >= dataAtual
    );
  }

  //CORRIGIR - AINDA NÃO FUNCIONANDO...
  #filtraAgenda(dataIni, dataFim, agenda) {
    if (dataIni !== undefined) {
      agenda.filter((agendamento) => {
        return agendamento.inicio - dataIni >= 0;
        /*(
          agendamento.inicio.getFullYear() > dataIni.getFullYear() ||
          (agendamento.inicio.getFullYear() === dataIni.getFullYear() &&
            agendamento.inicio.getMonth() > dataIni.getMonth()) ||
          (agendamento.inicio.getFullYear() === dataIni.getFullYear() &&
            agendamento.inicio.getMonth() === dataIni.getMonth() &&
            agendamento.inicio.getDate() >= dataIni.getDate())
        );*/
      });
    } else if (dataFim !== undefined) {
      agenda.filter((agendamento) => {
        return agendamento.fim - dataFim <= 0; /*return (
          agendamento.inicio.getFullYear() < dataFim.getFullYear() ||
          (agendamento.inicio.getFullYear() === dataFim.getFullYear() &&
            agendamento.inicio.getMonth() < dataFim.getMonth()) ||
          (agendamento.inicio.getFullYear() === dataFim.getFullYear() &&
            agendamento.inicio.getMonth() === dataFim.getMonth() &&
            agendamento.inicio.getDate() <= dataFim.getDate())
        );*/
      });
    }
    return agenda;
  }

  listaAgenda(dataInicial, dataFinal) {
    //Verificando se existem os parametros de data e se são válidos
    if (!validaRegexData(dataInicial))
      throw { codErro: 1, descErro: "Data inicial em formato incorreta!" };

    if (!validaRegexData(dataFinal))
      throw { codErro: 2, descErro: "Data final em formato incorreta!" };

    let dtIni = dataInicial !== undefined ? dataInicial.split("/") : undefined;
    dtIni =
      dtIni !== undefined
        ? new Date(dtIni[2], dtIni[1] - 1, dtIni[0], 23, 59, 999)
        : undefined;
    let dtFim = dataFinal !== undefined ? dataInicial.split("/") : undefined;
    dtFim =
      dtFim !== undefined
        ? new Date(dtFim[2], dtFim[1] - 1, dtFim[0], 23, 59, 999)
        : undefined;

    //Ordenando lista por agendamento
    let agendaListar = [
      ...this.#agenda.sort((agendamento1, agendamento2) => {
        return agendamento1.inicio - agendamento2.inicio;
      }),
    ];

    //Filtrar agenda
    agendaListar = this.#filtraAgenda(dtIni, dtFim, agendaListar);

    //Imprimir agenda
    this.#imprimirAgendamentos(agendaListar);
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
    let agendamento = undefined;
    console.log("------------------------------------------------------------");
    console.log("CPF           Nome        Dt.Nasc.   Idade ");
    for (const paciente of this.#pacientes) {
      console.log(
        `${paciente.cpf}  ${paciente.nome}  ${paciente.dtNasc}  ${paciente.idade}`
      );
      agendamento = this.#buscaFuturoAgendamento(paciente.cpf);
      if (agendamento !== undefined)
        console.log(
          `            Agendado para: ${agendamento.data}\n            ${agendamento.horaInicio} às ${agendamento.horaFim}`
        );
    }
    console.log("------------------------------------------------------------");
  }

  #imprimirAgendamentos(agenda) {
    let dataAnterior = null;
    console.log("------------------------------------------------------------");
    console.log("  Data   H.Ini  H.Fim  Tempo  Nome  Dt.Nasc. ");
    for (const agendamento of agenda) {
      console.log(
        `${
          agendamento.data === dataAnterior ? `          ` : agendamento.data
        }  ${agendamento.horaInicio}  ${agendamento.horaFim}  ${
          agendamento.tempo
        }  ${agendamento.nomePaciente} ${agendamento.dtNascPaciente} `
      );
      dataAnterior = agendamento.data;
    }
    console.log("------------------------------------------------------------");
  }
}
