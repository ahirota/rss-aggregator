import { setUser } from "./config";
import { createUser, deleteAllUsers, getUser } from "./db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error('Login handler expects a single argument: name');
    }
    const name = args[0];
    const exists = await getUser(name);
    if (!exists) {
        throw new Error(`User with name "${name}" does not exist.`);
    }
    setUser(name);
    console.log(`Successfully logged in with user: ${name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error('Register handler expects a single argument: Name');
    }
    const name = args[0];
    const exists = await getUser(name);
    if (exists) {
        throw new Error(`User with name "${name}" already exists.`);
    }
    const newUser = await createUser(name);
    setUser(name);
    console.log(`Successfully registered user with name: ${name}`);
    console.log(newUser);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await deleteAllUsers();
}