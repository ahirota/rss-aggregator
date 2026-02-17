import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { posts, feedFollows, feeds } from "../schema";
import { type RSSItem } from "../../../src/rss/feed";

// CREATE
export async function createPost(feedId: string, item: RSSItem) {
    const [result] = await db.insert(posts).values({
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            feedId: feedId
        }).returning();
    return result;
}

// READ
export async function getPostsForUser(userId: string, numPosts: number) {
    const result = await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedId: posts.feedId,
        feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(numPosts);

  return result;
}