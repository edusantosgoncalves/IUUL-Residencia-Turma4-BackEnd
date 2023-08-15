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

  // * Sincroniza tabela
  async sync(force) {
    try {
      await Paciente.sync({ force: force });
      await Agendamento.sync({ force: force });
      return { status: true, msg: "Tabelas sincronizadas" };
    } catch (e) {
      return { status: false, msg: `Erro na sincronização das tabelas: ${e}` };
    }
  }

  // * Retorna todos os pacientes
  async getPacientes() {
    return await Paciente.findAll();
  }

  // * Retorna um paciente pelo CPF
  async getPacienteByCPF(cpf) {
    return await Paciente.findOne({
      where: {
        cpf: cpf,
      },
    });
  }

  // * Adiciona paciente
  async addPaciente(cpf, nome, data_nascimento) {
    try {
      const pac = await Paciente.create({
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

        // Se for um erro de validação, retorne-o
        if (erro.type === "Validation error")
          throw { tipo: 2, campo: erro.path, msg: erro.message };

        //Se não for nenhum dos tipos validados, retorne-o
        throw { tipo: erro.type, campo: erro.path, msg: erro.message };
      }
      /*//Se o erro for de validação ou paciente já cadastrado (CPF), somente gere a exceção deste
      if (e.name === "SequelizeValidationError") {
        let erro = "Erros de validação:\n";
        for (const err of e.errors) {
          erro += err.message + "\n";
        }
        throw erro; //`${e.message}`;
      }
      if (e.name === "SequelizeUniqueConstraintError") {
        throw e;
      }
      //Se for outro erro, gere a exceção deste junto a uma string "Erro: "
      else throw `Erro: ${e}`;*/
    }
  }

  // * Remove paciente
  async removePacienteByCPF(cpf) {
    //Obtendo paciente pelo cpf
    const paciente = await this.getPacienteByCPF(cpf);
    //Se não encontrar paciente, gere uma exceção
    if (!paciente) {
      throw { msg: "Paciente não cadastrado!" };
    }

    //Obtendo futuro agendamento para o paciente
    const agendamento = this.getAgendamentosFuturosByPaciente(paciente);
    //Se encontrar agendamento, gere uma exceção
    if (agendamento) {
      throw { msg: "Paciente com consulta futura agendada!" };
    }

    //Se não encontrar agendamento, remova o paciente.
    return await Paciente.destroy({ where: { id: paciente.id } });
  }

  // * Retorna todos os agendamentos
  async getAgendamentos(inicio = undefined, fim = undefined) {
    if (inicio !== undefined && fim !== undefined) {
      return await Agendamento.findAll({
        where: { inicio: { [Op.gte]: inicio }, fim: { [Op.gte]: fim } },
      });
    } else if (inicio !== undefined) {
      return await Agendamento.findAll({
        where: { inicio: { [Op.gte]: inicio } },
      });
    } else if (fim !== undefined) {
      return await Agendamento.findAll({
        where: { fim: { [Op.gte]: fim } },
      });
    } else return await Agendamento.findAll();
  }

  // * Retorna todos os agendamentos futuros (falta validar...)
  async getAgendamentosFuturos(inicio = undefined, fim = undefined) {
    try {
      if (inicio !== undefined && fim !== undefined) {
        const [agendamentos, metadados] = await sq.query(
          `SELECT TO_CHAR(a.inicio, 'dd/mm/yyyy') as data,a.id , TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim, TO_CHAR(a.fim - a.inicio,'HH24:MI') as tempo, p.nome as nome_paciente, TO_CHAR(data_nascimento, 'dd/mm/yyyy') as data_nascimento_paciente FROM desafio3.agendamento a JOIN desafio3.paciente p on a.id_paciente = p.id WHERE a.inicio >= NOW AND () order by data, inicio;`
        );
      } else if (inicio !== undefined) {
        return await Agendamento.findAll({
          where: { inicio: { [Op.gte]: inicio } },
        });
      } else if (fim !== undefined) {
        return await Agendamento.findAll({
          where: { fim: { [Op.gte]: fim } },
        });
      }
      const [agendamentos, metadados] = await sq.query(
        "SELECT TO_CHAR(a.inicio, 'dd/mm/yyyy') as data,a.id , TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim, TO_CHAR(a.fim - a.inicio,'HH24:MI') as tempo, p.nome as nome_paciente, TO_CHAR(data_nascimento, 'dd/mm/yyyy') as data_nascimento_paciente FROM desafio3.agendamento a JOIN desafio3.paciente p on a.id_paciente = p.id WHERE a.inicio >= NOW() order by data, inicio;"
      );

      return agendamentos;
    } catch (e) {
      throw { tipo: "Erro ao obter agendamentos", erro: e };
    }
  }

  // * Retorna um agendamento pelo paciente
  async getAgendamentosByPaciente(paciente) {
    return await Agendamento.findAll({
      where: {
        id_paciente: paciente.id,
      },
    });
  }

  // * Retorna todos os agendamentos futuros de um paciente
  async getAgendamentosFuturosByPaciente(paciente) {
    return await Agendamento.findOne({
      where: {
        id_paciente: paciente.id,
        inicio: { [Op.gte]: new Date() },
      },
    });
  }

  // * Retorna todos os agendamentos em um intervalo
  async getAgendamentosIntervalo(agendamento) {
    return await Agendamento.findOne({
      where: {
        inicio: { [Op.between]: [agendamento.inicio, agendamento.fim] },
        fim: { [Op.between]: [agendamento.inicio, agendamento.fim] },
      },
    });
  }

  // * Valida formato de dados de inserção de agendamento
  async validaDadosAddAgendamento(paciente, data, horaIni, horaFim) {
    //Validando campos
    try {
      const ag = await Agendamento.build({
        id_paciente: paciente.id,
        data: data,
        inicio: horaIni,
        fim: horaFim,
      });
      await ag.validate();
      return ag;
    } catch (e) {
      if (e.errors) {
        //Itere sobre os erros
        for (const erro of e.errors) {
          // Se for um erro de validação, retorne-o
          if (erro.type === "Validation error") {
            throw { tipo: 2, campo: erro.path, msg: erro.message };
          }

          //Se não for nenhum dos tipos validados, retorne-o
          throw { tipo: erro.type, campo: erro.path, msg: erro.message };
        }
      }
      throw e;
    }
  }

  // * Valida formato de dados de cancelamento de agendamento
  async validaFormatoDadosCancelAgendamento(paciente, data, horaIni) {
    //Validando campos
    try {
      return await Agendamento.build({
        id_paciente: paciente.id,
        data: data,
        inicio: horaIni,
      });
    } catch (e) {
      throw e;
    }
  }

  // * Adiciona agendamento
  async agendaConsulta(agendamento) {
    //Agendando consulta:
    try {
      return await agendamento.save();
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
    await Agendamento.destroy({
      where: { id_paciente: paciente.id, inicio: inicio },
    });
  }

  // * Obtem pacientes ordenados pelo CPF
  async getPacientesOrderByCPF() {
    try {
      const [pacientes, metadados] = await sq.query(
        "SELECT p.id, p.cpf, p.nome, TO_CHAR(p.data_nascimento, 'dd/mm/yyyy') as data_nascimento, TO_CHAR(inicio, 'dd/mm/yyyy') as data_agendamento, DATE_PART('YEAR', age(p.data_nascimento)) as idade, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim FROM desafio3.paciente p LEFT JOIN desafio3.agendamento a ON p.id = a.id_paciente ORDER BY p.cpf ASC;"
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
        "SELECT p.id, p.cpf, p.nome, TO_CHAR(p.data_nascimento, 'dd/mm/yyyy') as data_nascimento, TO_CHAR(inicio, 'dd/mm/yyyy') as data_agendamento, DATE_PART('YEAR', age(p.data_nascimento)) as idade, TO_CHAR(a.inicio,'HH24:MI') as inicio, TO_CHAR(a.fim,'HH24:MI') as fim FROM desafio3.paciente p LEFT JOIN desafio3.agendamento a ON p.id = a.id_paciente ORDER BY p.nome ASC;"
      );
      return pacientes;
    } catch (e) {
      throw `Erro ao obter lista de pacientes ordenada por CPF: ${e}`;
    }
  }
}
