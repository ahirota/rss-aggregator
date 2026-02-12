import { readConfig } from "./config";
import { createFeed, getFeed } from "./db/queries/feeds";
import { getUser } from "./db/queries/users";
import { type Feed, type User } from "./db/schema";
import { fetchFeed } from "./rss/feed";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feedUrl = "https://www.wagslane.dev/index.xml";

    const rssFeed = await fetchFeed(feedUrl);

    console.log(rssFeed);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error('Add Feed handler expects two arguments: name and url');
    }

    const config = readConfig();
    const currentUser = await getUser(config.currentUserName);

    if (!currentUser) {
        throw new Error(`An unexpected error occured: Current user "${config.currentUserName}" is invalid`);
    }
    
    const name = args[0];
    const url = args[1];

    const exists = await getFeed(url);
    if (exists) {
        throw new Error(`Feed with URL "${url}" already exists.`);
    }

    const newFeed = await createFeed(name, url, currentUser.id);
    printFeed(newFeed, currentUser);
}

function printFeed(feed: Feed, user: User) {
    console.log("Current User:");
    console.log(user);
    console.log("Newly Added Feed:");
    console.log(feed);
}