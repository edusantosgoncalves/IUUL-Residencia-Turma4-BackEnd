// Importando modelo
import { Agendamento } from "../model/Agendamento.js";

export const PacienteController = {
  // * Sincroniza tabela
  async sync(force) {
    return await Agendamento.sync({ force: force });
  },

  // * Retorna todos os agendamentos
  async getAgendamentos() {
    return await Agendamento.findAll();
  },

  // * Retorna todos os agendamentos futuros
  async getAgendamentosFuturos() {},

  // * Retorna um agendamento pelo paciente
  async getAgendamentosByPaciente(paciente) {},

  // * Retorna todos os agendamentos futuros de um paciente
  async getAgendamentosFuturosByPaciente(paciente) {},

  // * Adiciona agendamento
  async addAgendamento(paciente, data, horaIni, horaFim) {},

  // * Remove agendamento
  async removeAgendamento(paciente, data, horaIni) {},
};
