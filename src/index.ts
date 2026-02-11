import { type CommandsRegistry, registerCommand, runCommand } from "./registry";
import { handlerLogin } from "./commands";

function main() {
    const registry: CommandsRegistry = {};
    registerCommand(registry, 'login', handlerLogin);

    const userArgs = process.argv.slice(2);

    if (userArgs.length === 0) {
        console.log('Error: Gator requires at least one argument. None provided.');
        process.exit(1);
    }

    const command = userArgs[0];
    const commandArgs = userArgs.slice(1);

    runCommand(registry, command, ...commandArgs);
}

main();