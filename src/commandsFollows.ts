import { readConfig } from "./config";
import { getUser } from "./db/queries/users";
import { getFeed } from "./db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "./db/queries/feedFollows";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error('Follow handler expects a single argument: url');
    }
    const url = args[0];
    const feedExists = await getFeed(url);
    if (!feedExists) {
        throw new Error(`Feed with URL "${url}" does not exist.`);
    }

    const config = readConfig();
    const userExists = await getUser(config.currentUserName);
    if (!userExists) {
        throw new Error(`User with name "${config.currentUserName}" does not exist.`);
    }
    
    const follow = await createFeedFollow(userExists.id, feedExists.id);

    console.log(`New follow: ${follow.userName} now following "${follow.feedName}"`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const config = readConfig();
    const userExists = await getUser(config.currentUserName);
    if (!userExists) {
        throw new Error(`User with name "${config.currentUserName}" does not exist.`);
    }

    const follows = await getFeedFollowsForUser(userExists.name);

    console.log(`${userExists.name} currently following {${follows.length}} feed(s).`)
    for (const follow of follows) {
        console.log(` - ${follow.feedName}`);
    }
}