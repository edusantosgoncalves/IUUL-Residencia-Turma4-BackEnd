//Importando o sequelize
import Sequelize from "sequelize";

//Instanciando o dotenv para trabalhar com as variáveis .env
import "dotenv/config";

const sq = new Sequelize({
  dialect: process.env.SEQ_DIALECT,
  host: process.env.SEQ_SERVER,
  port: process.env.SEQ_PORT,
  username: process.env.SEQ_USER_DB,
  password: process.env.SEQ_USER_PWD,
  database: process.env.SEQ_DB,
  schema: process.env.SEQ_DB_SCH_D3,
  timezone: "-03:00",
});

//sq.options.logging = false;

export { sq };
