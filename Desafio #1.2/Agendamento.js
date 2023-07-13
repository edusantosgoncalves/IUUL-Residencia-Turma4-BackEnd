export default class Agendamento {
  #inicio;
  #fim;
  #paciente;

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
    this.#inicio = new Date(
      dataSplit[2],
      dataSplit[1] - 1,
      dataSplit[0],
      horaIni.substring(0, 2),
      horaIni.substring(2, 4)
    );

    this.#fim = new Date(
      dataSplit[2],
      dataSplit[1] - 1,
      dataSplit[0],
      horaFim.substring(0, 2),
      horaFim.substring(2, 4)
    );

    this.#paciente = paciente;
  }

  //Obter tempo da consulta
  get tempo() {
    const diffEmMilissegundos = Math.abs(this.#fim - this.#inicio);
    const diffEmMinutos = Math.floor(diffEmMilissegundos / (1000 * 60));
    const horas = Math.floor(diffEmMinutos / 60);
    const minutos = diffEmMinutos % 60;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
      2,
      "0"
    )}`;
  }

  //Obtendo hora de início da consulta
  get horaInicio() {
    return `${String(this.#inicio.getHours()).padStart(2, "0")}:${String(
      this.#inicio.getMinutes()
    ).padStart(2, "0")}`;
  }

  //Obtendo hora final da consulta
  get horaFim() {
    return `${String(this.#fim.getHours()).padStart(2, "0")}:${String(
      this.#fim.getMinutes()
    ).padStart(2, "0")}`;
  }

  //Obter data da consulta
  get data() {
    return `${String(this.#inicio.getDate()).padStart(2, "0")}/${String(
      parseInt(this.#inicio.getMonth()) + 1
    ).padStart(2, "0")}/${String(this.#inicio.getFullYear()).padStart(2, "0")}`;
  }

  //Obter data e hora de início da consulta
  get inicio() {
    return this.#inicio;
  }

  //Obter data e hora final da consulta
  get fim() {
    return this.#fim;
  }

  //Obter cpf do paciente
  get cpfPaciente() {
    return this.#paciente.cpf;
  }

  //Obter nome do paciente
  get nomePaciente() {
    return this.#paciente.nome;
  }

  //Obter data de nascimento do paciente
  get dtNascPaciente() {
    return this.#paciente.dtNasc;
  }

  //Função que valida se a data de agendamento é válida
  #validaDt(data, horaIni, horaFim) {
    const regexData =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[1,2])\/(19|20)\d{2}$/;

    //Validando se a data está no formato correto
    if (!regexData.test(data)) return 1;

    //Criando instância Date para comparar as datas
    let dataSplit = data.split("/");
    let dt = new Date(dataSplit[2], dataSplit[1] - 1, dataSplit[0]);
    dt = new Date(dt.toDateString());
    let dtAtual = new Date();

    //Validando se a data inserida é igual ou posterior a data atual
    if (dt < dtAtual) return 2;

    //Validando se as horas estão no padrão correto
    const regexHora = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;

    if (!regexHora.test(horaIni)) return 3.1;
    if (!regexHora.test(horaFim)) return 3.2;

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
