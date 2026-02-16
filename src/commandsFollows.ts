import { getFeedByUrl } from "./db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "./db/queries/feedFollows";
import { type User } from "./db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error('Follow handler expects a single argument: url');
    }
    
    const url = args[0];
    const feed = await getFeedByUrl(url);
    
    if (!feed) {
        throw new Error(`Feed with URL "${url}" does not exist.`);
    }
    
    const follow = await createFeedFollow(user.id, feed.id);

    console.log(`New follow: ${follow.userName} now following "${follow.feedName}"`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    const follows = await getFeedFollowsForUser(user.name);

    console.log(`${user.name} currently following {${follows.length}} feed(s).`)
    for (const follow of follows) {
        console.log(` - ${follow.feedName}`);
    }
}