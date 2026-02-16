import { readConfig } from "./config";
import { createFeed, getFeed, getFeeds } from "./db/queries/feeds";
import { getUser, getUserByID } from "./db/queries/users";
import { type Feed, type User } from "./db/schema";
import { fetchFeed } from "./rss/feed";
import { createFeedFollow } from "./db/queries/feedFollows";

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
    await createFeedFollow(currentUser.id, newFeed.id);
    printFeed(newFeed, currentUser);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        console.log(`Feed: ${feed.name}`);
        console.log(`------------------`);
        console.log(`URL: ${feed.url}`);
        const user = await getUserByID(feed.user_id);
        console.log(`Added By: ${user.name}`);
        console.log();
    }
}

function printFeed(feed: Feed, user: User) {
    console.log("Current User:");
    console.log(user);
    console.log("Newly Added Feed:");
    console.log(feed);
}