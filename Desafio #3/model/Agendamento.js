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
    data: {
      type: DataTypes.VIRTUAL,
      set(value) {
        //Validando se a string está no formato correto
        const regexData =
          /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

        if (!regexData.test(value))
          throw {
            campo: "data",
            tipo: 2,
            msg: "Data no formato incorreto!",
          };

        //Obtendo dados de data da string recebida
        let dataSplit = value.split("/");

        //Setando o atributo em uma instância Date
        this.setDataValue(
          "data",
          new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0])
        );
      },
      validate: {
        //Validando se a data inserida é anterior a atual
        validaDataAnterior(value) {
          let dtAtual = new Date();
          if (value < dtAtual)
            throw "A data de agendamento não pode ser anterior a data atual!";
        },
      },
    },
    inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      set(value) {
        //Validando se as horas estão no padrão correto
        const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;
        if (!regexHora.test(value)) {
          throw {
            campo: "inicio",
            tipo: 2,
            msg: "Hora inicial no formato incorreto!",
          };
        }

        //Definindo variável para inserir ao atributo
        const inicio = new Date(this.get("data").toString());
        inicio.setHours(Number(value.substr(0, 2)));
        inicio.setMinutes(Number(value.substr(2)));
        this.setDataValue("inicio", inicio);
      },
    },
    fim: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      validate: {
        eIntervaloValido() {
          //Obtendo intervalos
          const inicio = this.get("inicio");
          const fim = this.get("fim");

          // Verificar se a hora inicial é posterior a hora final
          if (fim <= inicio)
            throw "Horário de término anterior ao horário de início.";

          //Verificando se os horários de fim e início são divisíveis por 15
          if (
            parseInt(inicio.getMinutes()) % 15 !== 0 ||
            parseInt(fim.getMinutes()) % 15 !== 0
          )
            throw "Intervalo não permitido!";

          //Definindo limites de horário
          const limiteIni = new Date(this.get("data").toString());
          limiteIni.setHours(8);
          limiteIni.setMinutes(0);

          const limiteFim = new Date(this.get("data").toString());
          limiteFim.setHours(19);
          limiteFim.setMinutes(0);

          //Verificando se os horários são permitidos (entre 8h-19h)
          if (
            inicio < limiteIni ||
            inicio > limiteFim ||
            fim < limiteIni ||
            fim > limiteFim
          )
            throw "Horário não permitido (não está entre 8h-19h)!";

          //Se a data de agendamento for a data atual, verifique as horas
          const horaAtual = new Date();

          // Caso a data seja a de hoje, verifique se o horário de agendamento é igual ou anterior ao atual
          if (inicio <= horaAtual) throw "Horário não permitido (já passou)!";
        },
      },
      set(value) {
        //Validando se as horas estão no padrão correto
        const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;
        if (!regexHora.test(value)) {
          throw {
            campo: "fim",
            tipo: 2,
            msg: "Hora final no formato incorreto!",
          };
        }

        //Definindo variável para inserir ao atributo
        const fim = new Date(this.get("data").toString());
        fim.setHours(Number(value.substr(0, 2)));
        fim.setMinutes(Number(value.substr(2)));
        this.setDataValue("fim", fim);
      },
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { schema: "desafio3", freezeTableName: true, tableName: "agendamento" }
);

export { Agendamento };
