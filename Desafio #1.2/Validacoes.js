export function validaRegexData(data) {
  //Validando se a data está no formato correto
  const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

  return regexData.test(data);
}

export function validaRegexHora(hora) {
  //Validando se a hora está no padrão correto
  const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;

  return regexHora.test(hora);
}

export function validaCPF(cpf) {
  if (cpf.length !== 11) return false;

  //Verificando se todos os dígitos são iguais
  const vrfDigitosIguais = true;
  const primeiroDigito = cpf[0];

  //Iterando sobre todos os dígitos do cpf
  for (let i = 1; i < cpf.length; i++) {
    //Se encontrar um dígito diferente, o cpf não tem todos os dígitos iguais
    if (cpf[i] !== primeiroDigito) {
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
  for (i = 1; i <= 9; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

  resto = soma % 11;

  if (resto == 0 || resto == 1) digito = 0;
  if (resto >= 2 && resto <= 10) digito = 11 - resto;

  if (digito !== parseInt(cpf.substring(9, 10))) return false;

  //Validando segundo dígito verificador
  soma = 0; //Zerando valor da soma anterior
  for (i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = soma % 11;

  if (resto == 0 || resto == 1) digito = 0;
  if (resto >= 2 && resto <= 10) digito = 11 - resto;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}
