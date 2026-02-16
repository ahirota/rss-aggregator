import { readConfig } from "./config";
import { getUserByName } from "./db/queries/users";
import { type CommandHandler, type UserCommandHandler } from "./registry";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]): Promise<void> => {
        const config = readConfig();
        if (!config.currentUserName) {
            throw new Error("User not logged in");
        }

        const currentUser = await getUserByName(config.currentUserName);
        if (!currentUser) {
            throw new Error(`User with name "${config.currentUserName}" does not exist.`);
        }
        
        await handler(cmdName, currentUser, ...args);
    }
}