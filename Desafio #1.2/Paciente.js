export default class Paciente {
  #cpf;
  #nome;
  #dtNasc;

  constructor(cpf, nome, dtNasc) {
    //Verificar se o nome do usuário tem 5 caracteres
    if (nome.length < 5)
      throw {
        codErro: 1,
        descErro: "Tamanho do nome inválido (< 5 caracteres)",
      };

    //Verificar se a data de nascimento está conforme
    const vrfData = this.#validaDtNasc(dtNasc);
    switch (vrfData) {
      case 1:
        throw {
          codErro: 2,
          descErro: "Data no formato incorreto!",
        };
      case 2:
        throw {
          codErro: 3,
          descErro: "Data inválida!",
        };
    }

    //Verificar se a idade do paciente >=13
    if (!this.#validaIdade(dtNasc)) {
      throw { codErro: 4, descErro: "Idade não permitida!" };
    }

    //Verificar se o CPF é valido
    if (!this.#validaCPF(cpf)) {
      throw { codErro: 5, descErro: "CPF inválido!" };
    }

    //Obtendo data
    const dataSplit = dtNasc.split("/");

    this.#cpf = cpf;
    this.#nome = nome;
    this.#dtNasc = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
  }

  //Getters dos atributos
  get cpf() {
    return this.#cpf;
  }

  get nome() {
    return this.#nome;
  }

  get dtNasc() {
    return `${this.#dtNasc.getDate()}/${
      parseInt(this.#dtNasc.getMonth()) + 1
    }/${this.#dtNasc.getFullYear()}`;
  }

  get idade() {
    const dtHoje = new Date();
    let idade = dtHoje.getFullYear() - this.#dtNasc.getFullYear();

    const mesAtual = dtHoje.getMonth();
    const mesNasc = this.#dtNasc.getMonth();
    const diaAtual = dtHoje.getDate();
    const diaNasc = this.#dtNasc.getDate();

    if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
      idade--;
    }

    return idade;
  }

  //Verificar se funciona...
  #validaCPF(cpf) {
    if (cpf.length !== 11) return false;

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

    if (vrfDigitosIguais === true) return false;

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

    if (digito !== parseInt(cpf.substring(9, 10))) return false;

    //Validando segundo dígito verificador
    soma = 0; //Zerando valor da soma anterior
    for (let i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = soma % 11;

    if (resto == 0 || resto == 1) digito = 0;
    if (resto >= 2 && resto <= 10) digito = 11 - resto;

    if (digito !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  #validaDtNasc(dtNasc) {
    const regexData =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

    if (!regexData.test(dtNasc)) return 1;

    //Criando instância Date para comparar as datas
    let dataSplit = dtNasc.split("/");
    let dataNasc = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

    //Validando se a data inserida é igual ou anterior a data atual
    return new Date(dataNasc.toDateString()) <=
      new Date(new Date().toDateString())
      ? 0
      : 2;
  }

  #validaIdade(dtNasc) {
    let dataSplit = dtNasc.split("/");
    let data = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
    const dtHoje = new Date();
    let idade = dtHoje.getFullYear() - data.getFullYear();

    const mesAtual = dtHoje.getMonth();
    const mesNasc = data.getMonth();
    const diaAtual = dtHoje.getDate();
    const diaNasc = data.getDate();

    if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
      idade--;
    }

    return idade >= 13;
  }
}
