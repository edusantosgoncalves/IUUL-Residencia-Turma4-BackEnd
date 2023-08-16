const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;

export function validaNome(nome) {
  return nome.length >= 5;
}

export function validaDtNasc(dtNasc) {
  //Validando se a string está no formato correto
  if (!regexData.test(dtNasc)) return 1;

  //Criando instância Date para comparar as datas
  let dataSplit = dtNasc.split("/");
  let dataNasc = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

  //Validando se a data inserida é igual ou anterior a data atual
  if (dataNasc > new Date()) return 2;

  //Validando idade
  const dtHoje = new Date();
  let idade = dtHoje.getFullYear() - dataNasc.getFullYear();

  const mesAtual = dtHoje.getMonth();
  const mesNasc = dataNasc.getMonth();
  const diaAtual = dtHoje.getDate();
  const diaNasc = dataNasc.getDate();

  if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
    idade--;
  }
  //Se a idade for maior ou igual a 13, retorne a instância Date com a data de nascimento
  return idade >= 13 ? dataNasc : 3;
}

export function validaCPF(cpf) {
  if (isNaN(cpf)) return 1;
  if (cpf.length !== 11) return 2;

  //Verificando se todos os dígitos são iguais
  let vrfDigitosIguais = true;
  const primeiroDigito = cpf.charAt(0);

  //Iterando sobre todos os dígitos do cpf
  for (let i = 1; i < 11; i++) {
    //Se encontrar um dígito diferente, o cpf não tem todos os dígitos iguais
    if (cpf.charAt(i) !== primeiroDigito) {
      vrfDigitosIguais = false;
      break;
    }
  }

  if (vrfDigitosIguais === true) return 3; //throw "CPF inválido: Todos os dígitos são iguais!";

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

  if (digito !== parseInt(cpf.substring(9, 10))) return 4; //throw "CPF inválido: 1º dígito verificador inválido!";

  //Validando segundo dígito verificador
  soma = 0; //Zerando valor da soma anterior
  for (let i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = soma % 11;

  if (resto == 0 || resto == 1) digito = 0;
  if (resto >= 2 && resto <= 10) digito = 11 - resto;

  if (digito !== parseInt(cpf.substring(10, 11))) return 5; //throw "CPF inválido: 2º dígito verificador inválido!";

  return true;
}

export function validaDataAgendamento(data) {
  //Validando se a data está no formato correto
  if (!regexData.test(data)) return 1;

  //Obtendo dados de data da string recebida
  const dataSplit = data.split("/");

  //Setando o atributo em uma instância Date
  const dt = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

  //Validando se a data inserida é anterior a atual
  const dtAtual = new Date();
  if (
    dt < new Date(dtAtual.getFullYear(), dtAtual.getMonth(), dtAtual.getDate())
  )
    return 2;

  return dt;
}

export function validaRegexHora(hora) {
  //Validando se a hora está no padrão correto
  const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;

  return regexHora.test(hora);
}

export function validaIntervaloHora(data, hrInicio, hrFim) {
  const inicio = new Date(data.toString());
  const fim = new Date(data.toString());

  //Setando horas nas instâncias Date de inicio e fim
  inicio.setHours(Number(hrInicio.substr(0, 2)));
  inicio.setMinutes(Number(hrInicio.substr(2)));

  fim.setHours(Number(hrFim.substr(0, 2)));
  fim.setMinutes(Number(hrFim.substr(2)));

  // Verificar se a hora inicial é posterior a hora final
  if (fim <= inicio) return 1;

  //Verificando se os horários de fim e início são divisíveis por 15
  if (
    parseInt(inicio.getMinutes()) % 15 !== 0 ||
    parseInt(fim.getMinutes()) % 15 !== 0
  )
    return 2;

  //Definindo limites de horário
  const limiteIni = new Date(data.toString());
  limiteIni.setHours(8);
  limiteIni.setMinutes(0);

  const limiteFim = new Date(data.toString());
  limiteFim.setHours(19);
  limiteFim.setMinutes(0);

  //Verificando se os horários são permitidos (entre 8h-19h)
  if (
    inicio < limiteIni ||
    inicio > limiteFim ||
    fim < limiteIni ||
    fim > limiteFim
  )
    return 3;

  //Se a data de agendamento for a data atual, verifique as horas
  const horaAtual = new Date();

  // Caso a data seja a de hoje, verifique se o horário de agendamento é igual ou anterior ao atual
  if (inicio <= horaAtual) return 4;

  return { inicio: inicio, fim: fim };
}

export function validaDataListarAgendamentos(data) {
  //Validando se a data está no formato correto
  if (!regexData.test(data)) return false;

  //Obtendo dados de data da string recebida
  const dataSplit = data.split("/");

  //Retornando instância Date com a data
  return new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
}
