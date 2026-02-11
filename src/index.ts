import { setUser, readConfig } from "./config";

function main() {
  setUser("Alex");
  const cfg = readConfig();
  console.log(cfg);
}

main();