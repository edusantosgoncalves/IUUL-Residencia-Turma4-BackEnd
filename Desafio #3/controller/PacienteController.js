// Importando modelo
import { Paciente } from "../model/Paciente.js";

export const PacienteController = {
  // * Sincroniza tabela
  async sync(force) {
    return await Paciente.sync({ force: force });
  },

  // * Retorna todos os pacientes
  async getPacientes() {
    return await Paciente.findAll();
  },

  // * Retorna um paciente pelo CPF
  async getPacienteByCPF(cpf) {
    return await Paciente.findOne({
      where: {
        cpf: cpf,
      },
    });
  },

  // * Adiciona paciente
  async addPaciente(cpf, nome, data_nascimento) {
    try {
      return await Paciente.create({
        cpf: cpf,
        nome: nome,
        data_nascimento: data_nascimento,
      });
    } catch (e) {
      //Se o erro for de validação ou paciente já cadastrado (CPF), somente gere a exceção deste
      if (
        e.name === "SequelizeValidationError" ||
        e.name === "SequelizeUniqueConstraintError"
      ) {
        let erro = "Erros de validação:\n";
        for (const err of e.errors) {
          erro += err.message + "\n";
        }
        throw erro; //`${e.message}`;
      }
      //Se for outro erro, gere a exceção deste junto a uma string "Erro: "
      else throw `Erro: ${e}`;
    }
  },

  // * Remove paciente
  async removePaciente(id) {
    await Paciente.destroy({ where: { id: id } });
  },
};
