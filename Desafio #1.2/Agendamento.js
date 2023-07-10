export default class Agendamento {
  constructor(data, horaIni, horaFim, paciente) {
    //Validando data e horas
    const vrfData = this.#validaDt(data, horaIni, horaFim);

    switch (vrfData) {
      case 1:
        throw "Data em formato incorreto!";
      case 2:
        throw "Data fora do período permitido!";
      case 3:
        throw "Horário(s) em formato incorreto!";
      case 4:
        throw "Horário não permitido!";
    }

    this.#data = data;
    this.#horaIni = horaIni;
    this.#horaFim = horaFim;
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

  get horaIni() {
    const horas = this.#horaIni.substr(0, 2);
    const minutos = this.#horaIni.substr(2);
    return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
  }

  get horaFim() {
    const horas = this.#horaFim.substr(0, 2);
    const minutos = this.#horaFim.substr(2);
    return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
  }

  get nomePaciente() {
    return paciente.nome;
  }

  get dtNascPaciente() {
    return paciente.dtNasc;
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

    //Se a data de agendamento for a data atual, verifique as horas
    const horaAtual = new Date()
      .toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/:/g, "");

    // Caso a data seja a de hoje, verifique se o horário de agendamento é igual ou anterior ao atual
    if (dt === dtAtual && horaIni <= horaAtual) return 4;

    // Verificar se a hora inicial é posterior a hora final
    if (horaFim < horaIni) return 4;

    return 0;
  }
}
