import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema";

// CREATE
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

// READ
export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

export async function getUserByID(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}

// DELETE
export async function deleteUsers() {
  await db.delete(users);
}