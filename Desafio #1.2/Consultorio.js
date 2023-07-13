//Importando Paciente
import Paciente from "./Paciente.js";
import Agendamento from "./Agendamento.js";
import { validaRegexData, validaRegexHora } from "./Validacoes.js";

export default class Consultorio {
  #pacientes = [];
  #agenda = [];
  constructor() {}

  //Buscando paciente
  buscaPaciente(cpf) {
    return this.#pacientes.find((paciente) => paciente.cpf === cpf);
  }

  //Cadastrando paciente no consultório
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

  //Remover paciente do consultório
  removePaciente(cpf) {
    //Buscar se o paciente existe
    const pacienteBuscado = this.buscaPaciente(cpf);
    if (pacienteBuscado === undefined)
      throw { codErro: 1, descErro: "Paciente não cadastrado!" };

    //Buscar se o paciente tem alguma consulta agendada futura
    if (this.#buscaFuturoAgendamento(cpf) !== undefined)
      throw { codErro: 2, descErro: "Paciente com consulta futura agendada!" };

    //Se não tiver, remove os seus agendamentos
    this.#removeAgendamentos(cpf);

    //Após, removendo o paciente
    this.#pacientes = this.#pacientes.filter(
      (paciente) => paciente.cpf !== cpf
    );
  }

  //Listando pacientes ordenados por cpf
  get listaPacientesOrderByCPF() {
    //Ordenando os pacientes por CPF
    this.#pacientes.sort((paciente1, paciente2) => {
      const cpfP1 = parseInt(paciente1.cpf);
      const cpfP2 = parseInt(paciente2.cpf);

      if (cpfP1 < cpfP2)
        return -1; //Se o cpf1 for menor que o cpf2, deve estar acima
      else if (cpfP1 > cpfP2)
        return 1; //Se o cpf1 for maior que o cpf2, deve estar abaixo
      else return 0; //Se o cpf1 for igual ao cpf2, pode manter na posição
    });

    //Imprimir lista no padrão
    this.#imprimirPacientes();
  }

  //Listando pacientes ordenados por nome
  get listaPacientesOrderByNome() {
    //Ordenando os pacientes por cpf
    this.#pacientes.sort((paciente1, paciente2) => {
      return paciente1.nome.localeCompare(paciente2.nome);
    });

    //Imprimindo a lista
    this.#imprimirPacientes();
  }

  //Buscando um agendamento futuro de um paciente
  #buscaFuturoAgendamento(cpf) {
    //Verificar se há futuros agendamentos
    return this.#agenda.find(
      (agendamento) =>
        agendamento.cpfPaciente === cpf && agendamento.inicio > new Date()
    );
  }

  //Agendando consulta para um paciente
  agendaConsulta(paciente, data, horaIni, horaFim) {
    //Verifica se há agendamentos futuros
    if (this.#buscaFuturoAgendamento(paciente.cpf) !== undefined)
      throw {
        codErro: 8,
        descErro: "Já existe um agendamento futuro para este paciente!",
      };

    //Verificar se há agendamento no período fornecido
    if (this.#verificaAgendamentoPeriodo(data, horaIni, horaFim))
      throw {
        codErro: 9,
        descErro: "Já existe um agendamento neste horário!",
      };

    //Se não houver, tente criar o agendamento
    try {
      const novoAgendamento = new Agendamento(data, horaIni, horaFim, paciente);
      this.#agenda.push(novoAgendamento);
    } catch (erro) {
      throw erro;
    }
  }

  //Função que cancela um agendamento
  cancelaAgendamento(paciente, data, horaIni) {
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

    //Definindo o horário de agendamento na data recebida instanciada
    dataAtual = new Date();
    dt.setHours(Number(horaIni.substring(0, 2)));
    dt.setMinutes(Number(horaIni.substring(2, 4)));

    //Verificando se o horário do agendamento já passou
    if (dataAtual > dt)
      throw { codErro: 4, descErro: "Hora fora do permitido!" };

    //Removendo o agendamento dos agendamentos
    this.#agenda = this.#agenda.filter((agendamento) => {
      return (
        agendamento.cpfPaciente !== paciente.cpf && agendamento.inicio !== dt
      );
    });
  }

  //Função que filtra a agenda conforme um período específicado (se este existir)
  #filtraAgenda(dataIni, dataFim, agenda) {
    //Se existir a data inicial, retorne os agendamentos que tiverem seu início nesta ou posterior a esta data
    if (dataIni !== undefined) {
      agenda = agenda.filter((agendamento) => {
        return agendamento.inicio >= dataIni;
      });
    }

    //Se existir a data final, retorne os agendamentos que tiverem seu início nesta ou anterior a esta data
    if (dataFim !== undefined) {
      agenda = agenda.filter((agendamento) => {
        return agendamento.inicio <= dataFim;
      });
    }

    return agenda;
  }

  //Lista a agenda
  listaAgenda(dataInicial, dataFinal) {
    //Verificando se existem os parametros de data e se são válidos
    if (dataInicial !== undefined) {
      if (!validaRegexData(dataInicial))
        throw { codErro: 1, descErro: "Data inicial em formato incorreta!" };
    }

    if (dataFinal !== undefined) {
      if (!validaRegexData(dataFinal))
        throw { codErro: 2, descErro: "Data final em formato incorreta!" };
    }

    //Se existir uma data inicial, transforme-a numa instância de data
    let dtIni = dataInicial !== undefined ? dataInicial.split("/") : undefined;
    dtIni =
      dtIni !== undefined
        ? new Date(dtIni[2], dtIni[1] - 1, dtIni[0], 0, 0)
        : undefined;

    //Se existir uma data final, transforme-a numa instância de data
    let dtFim = dataFinal !== undefined ? dataInicial.split("/") : undefined;
    dtFim =
      dtFim !== undefined
        ? new Date(dtFim[2], dtFim[1] - 1, dtFim[0], 23, 59)
        : undefined;

    //Filtrar agenda
    let agendaListar = [...this.#agenda];
    agendaListar = this.#filtraAgenda(dtIni, dtFim, agendaListar);

    //Ordenando agenda por data de agendamento.
    agendaListar = agendaListar.sort((agendamento1, agendamento2) => {
      return agendamento1.inicio - agendamento2.inicio;
    });

    //Imprimir agenda
    this.#imprimirAgendamentos(agendaListar);
  }

  //Removendo todos os agendamentos de determinado paciente
  #removeAgendamentos(cpf) {
    this.#agenda = this.#agenda.filter(
      (agendamento) => agendamento.cpfPaciente === cpf
    );
  }

  //Verificando se há algum agendamento em determinado período (hora de inicio e fim) determinado
  #verificaAgendamentoPeriodo(data, horaIni, horaFim) {
    //Obtendo dados da data da variável data
    const dataSplit = data.split("/");

    //Definindo o início
    const hrIni = new Date(
      dataSplit[2],
      dataSplit[1] - 1,
      dataSplit[0],
      horaIni.substring(0, 2),
      horaIni.substring(2)
    );

    //Definindo o fim
    const hrFim = new Date(
      dataSplit[2],
      dataSplit[1] - 1,
      dataSplit[0],
      horaFim.substring(0, 2),
      horaFim.substring(2, 4)
    );

    //Verificando na agenda se existe alguma consulta inclusa no período definido
    return this.#agenda.find(
      (agendamento) =>
        (hrIni >= agendamento.inicio && hrFim <= agendamento.fim) ||
        (hrFim > agendamento.inicio && hrFim <= agendamento.fim) ||
        (hrIni <= agendamento.inicio && hrFim >= agendamento.fim)
    );
  }

  //Imprimindo os pacientes
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

  //Imprimindo os agendamentos
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
