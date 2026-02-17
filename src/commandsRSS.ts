import { createFeed, getFeeds, getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { getUserByID } from "./db/queries/users";
import { type Feed, type User } from "./db/schema";
import { fetchFeed } from "./rss/feed";
import { createFeedFollow } from "./db/queries/feedFollows";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error('Aggregate handler expects one argument: time_between_reqs');
    }
    
    const time_between_reqs = args[0];

    const timeBetweenRequests = parseDuration(time_between_reqs);
    
    console.log(`Collecting feeds every ${time_between_reqs}`);
    console.log();

    await scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log();
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        throw new Error('Failed to get next feed');
    }

    const marked = await markFeedFetched(nextFeed.id);
    if (!nextFeed) {
        throw new Error('Failed to mark feed to be fetched');
    }

    const rssFeed = await fetchFeed(marked.url);

    console.log(`Retrieved RSS Feed ${rssFeed.metadata.title} at ${rssFeed.metadata.link}`);
    console.log(`Listing Feed Items:`);
    console.log(`-------------------`);
    for (const item of rssFeed.items) {
        console.log(`* ${item.title}`);
    }
    console.log(`-------------------`);
    console.log();
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error('Invalid time between requests string.');
    }

    const duration = Number(match[1]);

    switch(match[2]) {
        case 'ms':
            return duration;
        case 's':
            return duration * 1000;
        case 'm':
            return duration * 1000 * 60;
        case 'h':
            return duration * 1000 * 60 * 60;
        default:
            throw new Error('Invalid time modifier for duration between requests.');
    }
}

function handleError(e: Error) {
    console.log();
    console.log(`-----------------------`);
    console.log(`An Error occurred while retrieving Blog RSS Feeds:`);
    console.log(e.message);
    console.log(`-----------------------`);
    console.log();
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