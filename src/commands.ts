import { setUser } from "./config";

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error('Login handler expects a single argument: username');
    }
    const username = args[0];
    setUser(username)
    console.log(`Successfully logged in with user: ${username}`);
}