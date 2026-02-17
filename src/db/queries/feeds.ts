import { asc, eq, sql } from "drizzle-orm";
import { db } from "../index";
import { feeds } from "../schema";

// CREATE
export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
  return result;
}

// READ
export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getNextFeedToFetch() {
  const [nextFeed] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`).limit(1);
  return nextFeed;
}

// UPDATE
export async function markFeedFetched(feedId: string) {
  const [result] = await db.update(feeds)
  .set({ updatedAt: new Date(), lastFetchedAt: new Date()})
  .where(eq(feeds.id, feedId))
  .returning();

  return result;
}