//import { AgendamentoController } from "./controller/AgendamentoController.js";
//import { PacienteController } from "./controller/PacienteController.js";
import { Menu } from "./Menu.js";

try {
  const menu = new Menu();
  const sync = await menu.sync(false);

  if (sync.status === false) console.log(sync.msg), process.exit(1);

  menu.menu();

  /*const edu = await ConsultorioController.getPacienteByCPF("05922677764");
  console.log(
    await ConsultorioController.addAgendamento(
      edu,
      "16/08/2023",
      "1100",
      "1130"
    )
  );*/
} catch (e) {
  console.log(e);
}
