import { type CommandsRegistry, registerCommand, runCommand } from "./registry";
import { handlerLogin, handlerRegister, handlerReset } from "./commands";

async function main() {
    const registry: CommandsRegistry = {};
    await registerCommand(registry, 'login', handlerLogin);
    await registerCommand(registry, 'register', handlerRegister);
    await registerCommand(registry, 'reset', handlerReset);

    const userArgs = process.argv.slice(2);

    if (userArgs.length === 0) {
        console.log('Error: Gator requires at least one argument. None provided.');
        process.exit(1);
    }

    const command = userArgs[0];
    const commandArgs = userArgs.slice(1);

    await runCommand(registry, command, ...commandArgs);

    process.exit(0);
}

main();