import { DateTime } from "luxon";

export default class ValidaPessoa {
  /*constructor(nome, cpf, dtNasc, rendaMensal = null, estadoCivil = null) {
    //Verificando se os campos obrigatórios foram recebidos
    if (nome === null) {
      throw {
        campo: "Nome",
        mensagem: "Não foi inserido! (é obrigatório)",
      };
    }

    if (cpf === null) {
      throw {
        campo: "CPF",
        mensagem: "Não foi inserido! (é obrigatório)",
      };
    }

    if (dtNasc === null) {
      throw {
        campo: "Data de nascimento",
        mensagem: "Não foi inserida! (é obrigatória)",
      };
    }

    //Verificar se o nome do usuário tem 5 caracteres
    if (!this.#validaNome(nome)) {
      throw {
        campo: "Nome",
        mensagem: "Inválido (< 5 ou > 60 caracteres)!",
      };
    }

    //Verificar se o CPF é valido
    if (!this.#validaCPF(cpf)) {
      throw { campo: "CPF", mensagem: "Inválido!" };
    }

    //Verificar se a data de nascimento está conforme
    switch (this.#validaDtNasc(dtNasc)) {
      case 1:
        throw {
          campo: "Data de nascimento",
          mensagem: "Formato incorreto!",
        };
      case 2:
        throw {
          campo: "Data de nascimento",
          mensagem: "Inválida!",
        };
      case 3:
        throw {
          campo: "Data de nascimento",
          mensagem: "Idade não permitida (menor de 18)!",
        };
    }

    //Validando parametros opcionais
    if (rendaMensal !== null) {
      switch (this.#validaRenda(rendaMensal)) {
        case 1:
          throw {
            campo: "Renda mensal",
            mensagem: "Formato incorreto!",
          };
        case 2:
          throw {
            campo: "Renda mensal",
            mensagem: "Valor inválido (< 0)!",
          };
      }
    }

    if (estadoCivil !== null) {
      if (!this.#validaEstadoCivil(estadoCivil)) {
        throw {
          campo: "Estado Civil",
          mensagem: "Formato incorreto!",
        };
      }
    }

    return true;
  }
*/

  constructor() {}
  //Validar nome
  validaNome(nome) {
    //Validando se foi recebido nome
    if (nome === undefined) {
      throw {
        campo: "Nome",
        mensagem: "Não foi inserido! (é obrigatório)",
      };
    }

    //Validando se nome está no tamanho indicado
    if (nome.length < 5 || nome.length > 60) {
      throw {
        campo: "Nome",
        mensagem: "Inválido (< 5 ou > 60 caracteres)!",
      };
    }
  }

  //Validar cpf
  validaCPF(cpf) {
    //Validando se foi recebido cpf
    if (cpf === undefined) {
      throw {
        campo: "CPF",
        mensagem: "Não foi inserido! (é obrigatório)",
      };
    }

    //Validando se o cpf tem o tamanho certo
    if (cpf.length !== 11) {
      throw {
        campo: "CPF",
        mensagem: "CPF inválido (não possui 11 caracteres)!",
      };
    }

    //Verificando se todos os dígitos são iguais
    let vrfDigitosIguais = true;
    const primeiroDigito = cpf.charAt(0);

    //Iterando sobre todos os dígitos do cpf
    for (let i = 1; i < cpf.length; i++) {
      //Se encontrar um dígito diferente, o cpf não tem todos os dígitos iguais
      if (cpf.charAt(i) !== primeiroDigito) {
        vrfDigitosIguais = false;
        break;
      }
    }

    if (vrfDigitosIguais === true) {
      throw { campo: "CPF", mensagem: "Inválido!" };
    }

    //Declarando variáveis para validar dígitos
    let soma = 0;
    let resto = 0;
    let digito = 0;

    //Validando primeiro dígito verificador
    for (let i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = soma % 11;

    if (resto == 0 || resto == 1) digito = 0;
    if (resto >= 2 && resto <= 10) digito = 11 - resto;

    if (digito !== parseInt(cpf.substring(9, 10))) {
      throw { campo: "CPF", mensagem: "Inválido!" };
    }

    //Validando segundo dígito verificador
    soma = 0; //Zerando valor da soma anterior
    for (let i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = soma % 11;

    if (resto == 0 || resto == 1) digito = 0;
    if (resto >= 2 && resto <= 10) digito = 11 - resto;

    if (digito !== parseInt(cpf.substring(10, 11))) {
      throw { campo: "CPF", mensagem: "Inválido!" };
    }
  }

  //Validar se a idade é permitida
  #validaIdade(dtNasc) {
    const idade = dtNasc.diffNow("years").get("years");
    return Math.abs(idade) >= 18;
  }

  //Validar data de nascimento
  validaDtNasc(dtNasc) {
    //Validando se foi recebido data
    if (dtNasc === undefined) {
      throw {
        campo: "Nome",
        mensagem: "Não foi inserido! (é obrigatório)",
      };
    }

    const regexData = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0,2])(19|20)\d{2}$/;

    //Validando se string está no formato desejado
    if (!regexData.test(dtNasc)) {
      throw {
        campo: "Data de nascimento",
        mensagem: "Formato incorreto!",
      };
    }

    //Criando instância DateTime (luxon) para comparar as datas
    const dia = dtNasc.substring(0, 2);
    const mes = dtNasc.substring(2, 4);
    const ano = dtNasc.substring(4, 8);

    const data = DateTime.local().set({ year: ano, month: mes, day: dia });

    //Validando se a data inserida é igual ou anterior a data atual
    if (data > DateTime.now()) {
      throw {
        campo: "Data de nascimento",
        mensagem: "Inválida!",
      };
    }

    //Validando a idade
    if (!this.#validaIdade(data)) {
      throw {
        campo: "Data de nascimento",
        mensagem: "Idade não permitida (menor de 18)!",
      };
    }
  }

  //Validar renda mensal
  validaRenda(rendaMensal) {
    //Validando se foi recebido data
    if (rendaMensal === undefined) return;

    //Validando se é um número
    const regexFloat = /^-?\d+(\,\d+)?$/;

    if (!regexFloat.test(rendaMensal)) {
      throw {
        campo: "Renda mensal",
        mensagem: "Formato incorreto!",
      };
    }

    //Criando instância do valor
    const valor = rendaMensal.replace(new RegExp(",", "g"), ".");

    //Validando se o valor é aceitável
    if (Number(valor) < 0) {
      throw {
        campo: "Renda mensal",
        mensagem: "Valor inválido (< 0)!",
      };
    }
  }

  //Validar estado civil
  validaEstadoCivil(estadoCivil) {
    //Validando se foi recebido estado civil
    if (estadoCivil === undefined) return;

    //Validando se estado civil confere
    switch (estadoCivil.toLowerCase()) {
      case "c":
      case "s":
      case "v":
      case "d":
        return true;
      default:
        throw {
          campo: "Estado Civil",
          mensagem: "Formato incorreto!",
        };
    }
  }
}
