export default class Agendamento {
  constructor(data, horaIni, horaFim, paciente) {
    //Validando data e horas
    const vrfData = this.#validaDt(data, horaIni, horaFim);

    switch (vrfData) {
      case 1:
        throw { codErro: 1, descErro: "Data em formato incorreto!" };

      case 2:
        throw { codErro: 2, descErro: "Data fora do período permitido!" };

      case 3:
        throw { codErro: 3, descErro: "Horário(s) em formato incorreto!" };

      case 4:
        throw {
          codErro: 4,
          descErro: "Horário não permitido (não está entre 8h-19h)!",
        };

      case 5:
        throw {
          codErro: 5,
          descErro: "Horário não permitido (horário já passou)!",
        };

      case 6:
        throw {
          codErro: 6,
          descErro: "Horário de término anterior ao horário de início.",
        };

      case 7:
        throw {
          codErro: 7,
          descErro: "Intervalo não permitido.",
        };
    }

    //Setando data
    const dataSplit = data.split("/");
    this.#data = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);

    this.#horaIni = new Date();
    this.#horaIni.setHours(Number(horaIni.substring(0, 2)));
    this.#horaIni.setMinutes(Number(horaIni.substring(2)));

    this.#horaFim = new Date();
    this.#horaFim.setHours(Number(horaFim.substring(0, 2)));
    this.#horaFim.setMinutes(Number(horaFim.substring(2)));

    this.#paciente = paciente;
  }

  get tempo() {
    const hrIni = parseInt(this.#horaIni.substr(0, 2));
    const minIni = parseInt(this.#horaIni.substr(2));
    const hrFim = parseInt(this.#horaFim.substr(0, 2));
    const minFim = parseInt(this.#horaFim.substr(2));

    // Passando as horas e minutos para somente minutos
    const minutosIni = hrIni * 60 + minIni;
    const minutosFim = hrFim * 60 + minFim;

    // Calculando a diferença entre os minutos
    const diferencaMinutos = minutosFim - minutosIni;

    // Passando a diferença para horas e minutos
    const horas = Math.floor(diferencaMinutos / 60);
    const minutos = diferencaMinutos % 60;

    // Retornando o tempo formatado em HH:MM
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
      2,
      "0"
    )}`;
  }

  get data() {
    return this.#data;
  }

  get horaIni() {
    return this.#horaIni;
    /*const horas = this.#horaIni.substr(0, 2);
    const minutos = this.#horaIni.substr(2);
    return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;*/
  }

  get horaFim() {
    return this.#horaFim;
    /*const horas = this.#horaFim.substr(0, 2);
    const minutos = this.#horaFim.substr(2);
    return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;*/
  }

  get cpfPaciente() {
    return this.#paciente.cpf;
  }

  get nomePaciente() {
    return this.#paciente.nome;
  }

  get dtNascPaciente() {
    return this.#paciente.dtNasc;
  }

  get dia() {
    return parseInt(this.#data.getDate());
  }

  get mes() {
    return parseInt(this.#data.getMonth()) + 1;
  }

  get dia() {
    return parseInt(this.#data.getFullYear());
  }

  #validaDt(data, horaIni, horaFim) {
    const regexData =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

    //Validando se a data está no formato correto
    if (!regexData.test(data)) return 1;

    //Criando instância Date para comparar as datas
    let dataSplit = data.split("/");
    let dt = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
    dt = new Date(dt.toDateString());
    let dtAtual = new Date(new Date().toDateString());

    //Validando se a data inserida é igual ou posterior a data atual
    if (!(dt === dtAtual) || !(dt > dtAtual)) return 2;

    //Validando se as horas estão no padrão correto
    const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;

    if (!regexHora.test(horaIni) || !regexHora.test(horaFim)) return 3;

    //Convertendo horas para instancias date
    const hrIni = new Date();
    hrIni.setHours(Number(horaIni.substr(0, 2)));
    hrIni.setMinutes(Number(horaIni.substr(2)));

    var hrFim = new Date();
    hrFim.setHours(Number(horaFim.substr(0, 2)));
    hrFim.setMinutes(Number(horaFim.substr(2)));

    //Verificando se os horários são permitidos (entre 8h-19h)
    const limiteIni = new Date().setHours(8);
    const limiteFim = new Date().setHours(19);

    if (
      hrIni < limiteIni ||
      hrIni > limiteFim ||
      hrFim < limiteIni ||
      hrFim > limiteFim
    )
      return 4;

    //Se a data de agendamento for a data atual, verifique as horas
    const horaAtual = new Date();

    // Caso a data seja a de hoje, verifique se o horário de agendamento é igual ou anterior ao atual
    if (dt === dtAtual && horaIni <= horaAtual) return 5;

    // Verificar se a hora inicial é posterior a hora final
    if (horaFim <= horaIni) return 6;

    // Verificar os minutos das horas são divisíveis por 15
    if (
      parseInt(horaFim.substring(2)) % 15 !== 0 ||
      parseInt(horaIni.substring(2)) % 15 !== 0
    )
      return 7;

    return 0;
  }
}
