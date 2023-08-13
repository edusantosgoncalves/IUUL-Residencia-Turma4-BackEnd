//Importando o sequelize
import Sequelize from "sequelize";

//Instanciando o dotenv para trabalhar com as variáveis .env
import "dotenv/config";

module.exports = {
  sq: new Sequelize({
    dialect: process.env.SEQ_DIALECT,
    host: process.env.SEQ_SERVER,
    port: process.env.SEQ_PORT,
    username: process.env.SEQ_USER,
    password: process.env.SEQ_USER_PWD,
    database: process.env.SEQ_USER.DB,
    schema: process.env.SEQ_DB_SCH_D3,
  }),
};
