"use server";

import { db } from "@/db";
import { account, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, inArray } from "drizzle-orm";

export async function getUsers() {
  try {
    const response = await db.select().from(user);

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getUserByID(id: string) {
  try {
    const response = await db.select().from(user).where(eq(user.id, id)).limit(1);

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function updateUserByID(id: string, data: typeof user.$inferInsert, password?: string) {
  try {
    const ctx = await auth.$context;

    const response = await db.transaction(async (tx) => {
      const responseUser = await tx.update(user).set(data).where(eq(user.id, id)).returning();

      if (password) {
        await tx
          .update(account)
          .set({
            password: await ctx.password.hash(password),
          })
          .where(eq(account.userId, id));
      }

      return responseUser;
    });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteUserByID(id: string) {
  try {
    const response = await db.delete(user).where(eq(user.id, id)).returning({ id: user.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteUsersByID(ids: string[]) {
  try {
    const response = await db.delete(user).where(inArray(user.id, ids)).returning({ ids: user.id });

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
