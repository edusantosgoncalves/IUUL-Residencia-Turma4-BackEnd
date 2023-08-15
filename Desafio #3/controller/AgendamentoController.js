// Importando modelo
import { Agendamento } from "../model/Agendamento.js";
import { Paciente } from "../model/Paciente.js";
import { Op } from "sequelize";

//Declarando relação 1xN de Paciente x Agendamento
Agendamento.belongsTo(Paciente, {
  foreignKey: "id_paciente",
});

export const AgendamentoController = {
  // * Sincroniza tabela
  async sync(force) {
    return await Agendamento.sync({ force: force });
  },

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
  },

  // * Retorna todos os agendamentos futuros
  async getAgendamentosFuturos() {
    return await Agendamento.findAll({
      where: { inicio: { [Op.gte]: "CURRENT_DATE" } },
    });
  },

  // * Retorna um agendamento pelo paciente
  async getAgendamentosByPaciente(paciente) {
    return await Agendamento.findAll({
      where: {
        id_paciente: paciente.id,
      },
    });
  },

  // * Retorna todos os agendamentos futuros de um paciente
  async getAgendamentosFuturosByPaciente(paciente) {
    return await Agendamento.findOne({
      where: {
        id_paciente: paciente.id,
        inicio: { [Op.gte]: "CURRENT_DATE" },
      },
    });
  },

  // * Adiciona agendamento
  async addAgendamento(paciente, data, horaIni, horaFim) {
    return await Agendamento.create({
      data: data,
      inicio: horaIni,
      fim: horaFim,
      id_paciente: paciente.id,
    });
  },

  // * Remove agendamento
  async removeAgendamento(paciente, dataIni) {
    await Paciente.destroy({
      where: { id_paciente: paciente.id, inicio: dataIni },
    });
  },
};
