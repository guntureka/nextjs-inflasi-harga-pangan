"use server";

import { db } from "@/db";
import { food, user } from "@/db/schema";
import { aliasedTable, asc, eq, getTableColumns, inArray } from "drizzle-orm";

export async function getFoods() {
  try {
    const response = await db.select().from(food);

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodsWithUser() {
  try {
    const createdBy = aliasedTable(user, "createdBy");
    const updatedBy = aliasedTable(user, "updatedBy");

    const response = await db
      .select({
        ...getTableColumns(food),
        createdBy: {
          id: createdBy.id,
          name: createdBy.name,
        },
        updatedBy: {
          id: updatedBy.id,
          name: updatedBy.name,
        },
      })
      .from(food)
      .leftJoin(createdBy, eq(food.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(food.updatedById, updatedBy.id))
      .orderBy(asc(food.name));

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodByID(id: string) {
  try {
    const response = await db.select().from(food).where(eq(food.id, id)).limit(1);

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createFood(data: typeof food.$inferInsert) {
  try {
    const response = await db.insert(food).values(data).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function updateFoodByID(id: string, data: typeof food.$inferInsert) {
  try {
    const response = await db.update(food).set(data).where(eq(food.id, id)).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodByID(id: string) {
  try {
    const response = await db.delete(food).where(eq(food.id, id)).returning({ id: food.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodsByID(ids: string[]) {
  try {
    const response = await db.delete(food).where(inArray(food.id, ids)).returning({ ids: food.id });

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
