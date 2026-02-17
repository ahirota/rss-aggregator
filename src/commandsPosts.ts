import { getPostsForUser } from "./db/queries/posts";
import { User } from "./db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2;
    if (args.length === 1) {
        const regex = /^(\d+)$/;
        const match = args[0].match(regex);
        if (!match) {
            throw new Error(`Browse Limit is required to be a Number.`);
        }
        limit = Number(args[0]);
    }

    const posts = await getPostsForUser(user.id, limit);
    
    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (const post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
}