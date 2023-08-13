//Importando instância sequelize do banco
import { sq } from "../database/db.js";

//Importando tipos de dados do Sequelize
import { DataTypes } from "sequelize";

//Definindo o modelo sequelize do Paciente
const Paciente = sq.define("Paciente", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Paciente já registrado!",
    },
    validate: {
      //Validando se a string é um número
      isNumeric: { msg: "CPF contém caracteres não numéricos!" },
      //Validando se a string tem 11 caracteres
      len: { args: [11, 11], msg: "CPF não contém 11 caracteres." },
      //Validando se é um cpf válido
      validaCPF(value) {
        //Verificando se todos os dígitos são iguais
        let vrfDigitosIguais = true;
        const primeiroDigito = value.charAt(0);

        //Iterando sobre todos os dígitos do cpf
        for (let i = 1; i < 11; i++) {
          //Se encontrar um dígito diferente, o cpf não tem todos os dígitos iguais
          if (value.charAt(i) !== primeiroDigito) {
            vrfDigitosIguais = false;
            break;
          }
        }

        if (vrfDigitosIguais === true)
          throw "CPF inválido: Todos os dígitos são iguais!";

        //Declarando variáveis para validar dígitos
        let soma = 0;
        let resto = 0;
        let digito = 0;

        //Validando primeiro dígito verificador
        for (let i = 1; i <= 9; i++)
          soma = soma + parseInt(value.substring(i - 1, i)) * (11 - i);

        resto = soma % 11;

        if (resto == 0 || resto == 1) digito = 0;
        if (resto >= 2 && resto <= 10) digito = 11 - resto;

        if (digito !== parseInt(value.substring(9, 10)))
          throw "CPF inválido: 1º dígito verificador inválido!";

        //Validando segundo dígito verificador
        soma = 0; //Zerando valor da soma anterior
        for (let i = 1; i <= 10; i++)
          soma = soma + parseInt(value.substring(i - 1, i)) * (12 - i);
        resto = soma % 11;

        if (resto == 0 || resto == 1) digito = 0;
        if (resto >= 2 && resto <= 10) digito = 11 - resto;

        if (digito !== parseInt(value.substring(10, 11)))
          throw "CPF inválido: 2º dígito verificador inválido!";
      },
    },
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: 5, msg: "Tamanho do nome inválido (< 5 caracteres)!" },
    },
  },

  data_nascimento: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      is: {
        args: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/,
        msg: "Data no formato incorreto!",
      },
      validaDataAtual(value) {
        //Criando instância Date para comparar as datas
        let dataSplit = value.split("/");
        let dataNasc = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

        //Validando se a data inserida é igual ou anterior a data atual
        if (Date(dataNasc.toDateString()) > new Date())
          throw "Data de nascimento posterior a data atual!";
      },
      validaIdade(value) {
        //Obtendo dados da data da variável dataNasc
        let dataSplit = value.split("/");

        //Definindo a data em uma instancia Date e obtendo a data de hoje, assim como a idade
        let data = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
        const dtHoje = new Date();
        let idade = dtHoje.getFullYear() - data.getFullYear();

        const mesAtual = dtHoje.getMonth();
        const mesNasc = data.getMonth();
        const diaAtual = dtHoje.getDate();
        const diaNasc = data.getDate();

        if (
          mesAtual < mesNasc ||
          (mesAtual === mesNasc && diaAtual < diaNasc)
        ) {
          idade--;
        }

        if (idade < 13) throw "Idade não permitida! (< 13)";
      },
    },
    get() {
      return `${String(this.data_nascimento.getDate()).padStart(
        2,
        "0"
      )}/${String(parseInt(this.data_nascimento.getMonth()) + 1).padStart(
        2,
        "0"
      )}/${String(this.data_nascimento.getFullYear()).padStart(2, "0")}`;
    },
  },
  idade: {
    type: DataTypes.VIRTUAL,
    get() {
      const dtHoje = new Date();
      let idade = dtHoje.getFullYear() - this.data_nascimento.getFullYear();

      const mesAtual = dtHoje.getMonth();
      const mesNasc = this.data_nascimento.getMonth();
      const diaAtual = dtHoje.getDate();
      const diaNasc = this.data_nascimento.getDate();

      if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
        idade--;
      }

      return idade;
    },
    set(value) {
      throw new Error(
        "A idade é calculada a partir da data de nascimento, logo, não pode ser inserida!"
      );
    },
  },
});

module.exports = Paciente;
