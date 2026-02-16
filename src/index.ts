import { type CommandsRegistry, registerCommand, runCommand } from "./registry";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commandsUsers";
import { handlerAddFeed, handlerAgg, handlerFeeds } from "./commandsRSS";
import { handlerFollow, handlerFollowing } from "./commandsFollows";
import { middlewareLoggedIn } from "./middleware";

async function main() {
    const registry: CommandsRegistry = {};
    // User Commands
    registerCommand(registry, 'login', handlerLogin);
    registerCommand(registry, 'register', handlerRegister);
    registerCommand(registry, 'users', handlerUsers);
    registerCommand(registry, 'reset', handlerReset);

    // RSS Commands
    registerCommand(registry, 'agg', handlerAgg);
    registerCommand(registry, 'addfeed', middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, 'feeds', handlerFeeds);

    // Follow Commands
    registerCommand(registry, 'follow', middlewareLoggedIn(handlerFollow));
    registerCommand(registry, 'following', middlewareLoggedIn(handlerFollowing));

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