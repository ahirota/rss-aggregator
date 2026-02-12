import { eq } from "drizzle-orm";
import { db } from "../index";
import { feeds } from "../schema";

// CREATE
export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db.insert(feeds).values({name: name, url: url, user_id: user_id}).returning();
  return result;
}

// READ
export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeed(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}