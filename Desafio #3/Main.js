import { Menu } from "./menus/Menu.js";

try {
  const menu = new Menu();
  const sync = await menu.sync();

  if (sync.status === false) console.log(sync.msg), process.exit(1);

  await menu.menu();
} catch (e) {
  console.log(e);
}
