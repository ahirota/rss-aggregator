import { eq, and } from "drizzle-orm";
import { db } from "../index";
import { users, feeds, feedFollows } from "../schema";

// CREATE
export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId }).returning();
    return await getFeedFollowWithNamesByID(newFeedFollow.id);
}

// READ
export async function getFeedFollowsForUser(userName: string) {
    const results = await db.select({
        userName: users.name,
        feedName: feeds.name
    }).from(users)
        .where(eq(users.name, userName))
        .innerJoin(feedFollows, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
    return results;
}

export async function getFeedFollowWithNamesByID(followID: string) {
    const [result] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    }).from(feedFollows)
        .where(eq(feedFollows.id, followID))
        .innerJoin(users, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feeds.id, feedFollows.feedId));
    return result;
}

// DELETE
export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db.delete(feedFollows)
        .where(and(
            eq(feedFollows.userId, userId),
            eq(feedFollows.feedId, feedId)
        ))
        .returning();

    return result;
}