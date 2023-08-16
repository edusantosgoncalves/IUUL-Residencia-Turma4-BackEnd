// Importando modelo
import { Agendamento } from "../model/Agendamento.js";
import { Paciente } from "../model/Paciente.js";
import { Op } from "sequelize";
import { sq } from "../database/db.js";

//Declarando relação 1xN de Paciente x Agendamento
Agendamento.belongsTo(Paciente, {
  foreignKey: "id_paciente",
});

export class ConsultorioController {
  constructor() {}

  // * Sincroniza tabela paciente
  async syncPaciente(force = false) {
    try {
      await Paciente.sync({ force: force });
      return { status: true, msg: "Paciente sincronizado!" };
    } catch (e) {
      return {
        status: false,
        msg: `Erro na sincronização de Paciente: ${e}`,
      };
    }
  }

  // * Retorna um paciente pelo CPF
  async getPacienteByCPF(cpf) {
    try {
      return await Paciente.findOne({
        where: {
          cpf: cpf,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  // * Adiciona paciente
  async addPaciente(cpf, nome, data_nascimento) {
    try {
      return await Paciente.create({
        cpf: cpf,
        nome: nome,
        data_nascimento: data_nascimento,
      });
    } catch (e) {
      //Itere sobre os erros
      for (const erro of e.errors) {
        //Se for um erro no unique (o campo unique na criação é o CPF, logo, só pode ser um paciente já registrado), retorne-o
        if (erro.type === "unique violation")
          throw { tipo: 1, msg: erro.message };

        //Se não for nenhum dos tipos validados, retorne-o
        throw { tipo: erro.type, campo: erro.path, msg: erro.message };
      }
    }
  }

  // * Remove paciente
  async removePacienteByCPF(cpf) {
    //Obtendo paciente pelo cpf
    let paciente;
    try {
      paciente = await this.getPacienteByCPF(cpf);
    } catch (e) {
      throw { msg: "Erro ao obter paciente", e };
    }

    //Se não encontrar paciente, gere uma exceção
    if (!paciente) {
      throw { msg: "Paciente não cadastrado!" };
    }

    //Obtendo futuro agendamento para o paciente
    let agendamento;
    try {
      agendamento = await this.getAgendamentosFuturosByPaciente(paciente);
    } catch (e) {
      throw { msg: "Erro ao obter agendamentos futuros do paciente", e };
    }

    //Se encontrar agendamento, gere uma exceção
    if (agendamento) {
      throw { msg: "Paciente com consulta futura agendada!" };
    }

    //Se não encontrar agendamento futuro, remova os agendamentos existentes do paciente e o mesmo
    await Agendamento.destroy({
      where: { id_paciente: paciente.id },
    });
    return await paciente.destroy();
  }

  // * Obtem pacientes ordenados pelo CPF
  async getPacientesOrderByCPF() {
    try {
      const [pacientes, metadados] = await sq.query(
        "SELECT p.id, p.cpf, p.nome, TO_CHAR(p.data_nascimento, 'dd/mm/yyyy') as data_nascimento, TO_CHAR(inicio, 'dd/mm/yyyy') as data_agendamento, DATE_PART('YEAR', age(p.data_nascimento)) as idade, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim FROM desafio3.paciente p LEFT JOIN desafio3.agendamento a ON p.id = a.id_paciente AND a.inicio >= NOW() ORDER BY p.cpf ASC;"
      );
      return pacientes;
    } catch (e) {
      throw `Erro ao obter lista de pacientes ordenada por CPF: ${e}`;
    }
  }

  // * Obtem pacientes ordenados pelo nome
  async getPacientesOrderByNome() {
    try {
      const [pacientes, metadados] = await sq.query(
        "SELECT p.id, p.cpf, p.nome, TO_CHAR(p.data_nascimento, 'dd/mm/yyyy') as data_nascimento, TO_CHAR(inicio, 'dd/mm/yyyy') as data_agendamento, DATE_PART('YEAR', age(p.data_nascimento)) as idade, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim FROM desafio3.paciente p LEFT JOIN desafio3.agendamento a ON p.id = a.id_paciente AND a.inicio >= NOW() ORDER BY p.nome ASC;"
      );
      return pacientes;
    } catch (e) {
      throw `Erro ao obter lista de pacientes ordenada por CPF: ${e}`;
    }
  }

  // * Sincroniza tabela Agendamento
  async syncAgendamento(force = false) {
    try {
      await Agendamento.sync({ force: force });
      return { status: true, msg: "Agendamento sincronizado!" };
    } catch (e) {
      return {
        status: false,
        msg: `Erro na sincronização de Agendamento: ${e}`,
      };
    }
  }

  // * Retorna os agendamentos, conforme a definição de inicio e fim
  async getAgendamentos(inicio = undefined, fim = undefined) {
    try {
      //SQL para consulta sem período
      let consulta =
        "SELECT TO_CHAR(a.inicio, 'dd/mm/yyyy') as data,a.id, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim, TO_CHAR(a.fim - a.inicio,'HH24:MI') as tempo,p.nome as nome_paciente, TO_CHAR(data_nascimento, 'dd/mm/yyyy') as data_nascimento_paciente FROM desafio3.agendamento a JOIN desafio3.paciente p on a.id_paciente = p.id order by data, inicio;";

      //Se for definido período, altere a query da consulta
      if (inicio !== undefined && fim !== undefined)
        consulta = `SELECT TO_CHAR(a.inicio, 'dd/mm/yyyy') as data,a.id, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim, TO_CHAR(a.fim - a.inicio,'HH24:MI') as tempo,p.nome as nome_paciente, TO_CHAR(data_nascimento, 'dd/mm/yyyy') as data_nascimento_paciente FROM desafio3.agendamento a JOIN desafio3.paciente p on a.id_paciente = p.id WHERE a.inicio >= '${inicio.toISOString()}' AND a.fim <= '${fim.toISOString()}' order by data, inicio;`;

      const [agendamentos, metadados] = await sq.query(consulta);

      return agendamentos;
    } catch (e) {
      throw { tipo: "Erro ao obter agendamentos", erro: e };
    }
  }

  // * Retorna todos os agendamentos futuros de um paciente
  async getAgendamentosFuturosByPaciente(paciente) {
    try {
      return await Agendamento.findOne({
        where: {
          id_paciente: paciente.id,
          inicio: { [Op.gte]: new Date() },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  // * Retorna todos os agendamentos em um intervalo
  async getAgendamentosIntervalo(inicio, fim) {
    try {
      return await Agendamento.findOne({
        where: {
          inicio: { [Op.between]: [inicio, fim] },
          fim: { [Op.between]: [inicio, fim] },
        },
      });
    } catch (e) {
      throw e;
    }
  }

  // * Adiciona agendamento
  async agendaConsulta(paciente, inicio, fim) {
    //Agendando consulta:
    try {
      return await Agendamento.create({
        inicio: inicio,
        fim: fim,
        id_paciente: paciente.id,
      });
    } catch (e) {
      //Itere sobre os erros
      for (const erro of e.errors) {
        // Se for um erro de validação, retorne-o
        if (erro.type === "Validation error")
          throw { tipo: 2, campo: erro.path, msg: erro.message };

        //Se não for nenhum dos tipos validados, retorne-o
        throw { tipo: erro.type, campo: erro.path, msg: erro.message };
      }
    }
  }

  // * Cancela agendamento
  async cancelaAgendamento(paciente, inicio) {
    try {
      return await Agendamento.destroy({
        where: { id_paciente: paciente.id, inicio: inicio },
      });
    } catch (e) {
      throw e;
    }
  }
}
