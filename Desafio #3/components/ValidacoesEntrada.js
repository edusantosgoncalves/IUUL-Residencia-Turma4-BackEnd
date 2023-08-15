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
