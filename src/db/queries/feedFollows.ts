import { eq } from "drizzle-orm";
import { db } from "../index";
import { users, feeds, feedFollows } from "../schema";

// CREATE
export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db.insert(feedFollows).values({user_id: user_id, feed_id: feed_id}).returning();
  return await getFeedFollowWithNamesByID(newFeedFollow.id);
}

// READ
export async function getFeedFollowsForUser(userName: string) {
  const results = await db.select({
    userName: users.name,
    feedName: feeds.name
  }).from(users)
  .where(eq(users.name, userName))
  .innerJoin(feedFollows, eq(users.id, feedFollows.user_id))
  .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id));
  return results;
}

export async function getFeedFollowWithNamesByID(followID: string) {
  const [result] = await db.select({
    id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    userName: users.name,
    feedName: feeds.name
  }).from(feedFollows)
  .where(eq(feedFollows.id, followID))
  .innerJoin(users, eq(users.id, feedFollows.user_id))
  .innerJoin(feeds, eq(feeds.id, feedFollows.feed_id));
  return result;
}