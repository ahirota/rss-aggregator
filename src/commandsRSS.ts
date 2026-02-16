import { createFeed, getFeeds } from "./db/queries/feeds";
import { getUserByID } from "./db/queries/users";
import { type Feed, type User } from "./db/schema";
import { fetchFeed } from "./rss/feed";
import { createFeedFollow } from "./db/queries/feedFollows";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feedUrl = "https://www.wagslane.dev/index.xml";

    const rssFeed = await fetchFeed(feedUrl);

    console.log(rssFeed);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error('Add Feed handler expects two arguments: name and url');
    }
    
    const name = args[0];
    const url = args[1];

    const newFeed = await createFeed(name, url, user.id);
    if (!newFeed) {
        throw new Error(`Failed to create new feed with URL: ${url}`);
    }
    
    const feedFollow = await createFeedFollow(user.id, newFeed.id);
    console.log(`New follow: ${feedFollow.userName} now following "${feedFollow.feedName}"`);

    printFeed(newFeed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        const user = await getUserByID(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }

        console.log(`Feed: ${feed.name}`);
        console.log(`------------------`);
        console.log(`URL: ${feed.url}`);
        console.log(`Added By: ${user.name}`);
        console.log();
    }
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:       ${feed.id}`);
    console.log(`* Created:  ${feed.createdAt}`);
    console.log(`* Updated:  ${feed.updatedAt}`);
    console.log(`* name:     ${feed.name}`);
    console.log(`* URL:      ${feed.url}`);
    console.log(`* User:     ${user.name}`);
}