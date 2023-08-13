// Importando modelo
import { Paciente } from "../model/Paciente.js";

module.exports = {
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
      await Paciente.create({
        cpf: cpf,
        nome: nome,
        data_nascimento: data_nascimento,
      });
    } catch (e) {
      //Se o erro for de validação, somente gere a exceção deste
      if (e instanceof Sequelize.ValidationError) throw `${e.errors}`;
      //Se for outro erro, gere a exceção deste junto a uma string "Erro: "
      else throw `Erro: ${e}`;
    }
  },
};
