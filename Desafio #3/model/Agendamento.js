//Importando instância sequelize do banco
import { sq } from "../database/db.js";

//Importando tipos de dados do Sequelize
import { DataTypes } from "sequelize";

//Definindo o modelo sequelize do Paciente
const Agendamento = sq.define(
  "Agendamento",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { schema: "desafio3", freezeTableName: true, tableName: "agendamento" }
);

export { Agendamento };
