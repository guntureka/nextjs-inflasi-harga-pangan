"use server";

import { db } from "@/db";
import { country, food, foodPrice, user } from "@/db/schema";
import { aliasedTable, and, asc, eq, getTableColumns, inArray, SQL, sql } from "drizzle-orm";

export async function getFoodPrices() {
  try {
    const response = await db.select().from(foodPrice);

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodPricesWithUserAndFood() {
  try {
    const createdBy = aliasedTable(user, "createdBy");
    const updatedBy = aliasedTable(user, "updatedBy");

    const prevYear = db
      .select({
        countryId: foodPrice.countryId,
        foodId: foodPrice.foodId,
        close: foodPrice.close,
        year: foodPrice.year,
        month: foodPrice.month,
      })
      .from(foodPrice)
      .as("prev");

    const response = await db
      .select({
        ...getTableColumns(foodPrice),
        food: {
          id: food.id,
          name: food.name,
        },
        country: getTableColumns(country),
        createdBy: {
          id: createdBy.id,
          name: createdBy.name,
        },
        updatedBy: {
          id: updatedBy.id,
          name: updatedBy.name,
        },
        inflationRate: sql<number | null>`
          CASE
            WHEN prev.close IS NOT NULL AND prev.close != 0
            THEN ROUND(((${foodPrice.close} - prev.close) / prev.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflationRate"),
      })
      .from(foodPrice)
      .leftJoin(country, eq(foodPrice.countryId, country.id))
      .leftJoin(food, eq(foodPrice.foodId, food.id))
      .leftJoin(createdBy, eq(foodPrice.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(foodPrice.updatedById, updatedBy.id))
      .leftJoin(
        prevYear,
        and(
          eq(sql`prev.country_id`, foodPrice.countryId),
          eq(sql`prev.food_id`, foodPrice.foodId),
          eq(sql`prev.month`, foodPrice.month),
          eq(sql`CAST(prev.year AS INTEGER)`, sql`CAST(${foodPrice.year} AS INTEGER) - 1`)
        )
      )
      .orderBy(asc(country.name));

    return response;
  } catch (error) {
    console.error("Error fetching food prices:", error);
    throw new Error("Failed to fetch food prices");
  }
}

export async function getFoodPricesWithParams({
  countryId,
  foodId,
  date,
  year,
  month,
}: {
  countryId?: string;
  foodId?: string;
  date?: string;
  year?: string;
  month?: string;
}) {
  try {
    const filters: SQL[] = [];

    const createdBy = aliasedTable(user, "createdBy");
    const updatedBy = aliasedTable(user, "updatedBy");

    const prevYear = db
      .select({
        countryId: foodPrice.countryId,
        foodId: foodPrice.foodId,
        close: foodPrice.close,
        year: foodPrice.year,
        month: foodPrice.month,
      })
      .from(foodPrice)
      .as("prev");

    let query = db
      .select({
        ...getTableColumns(foodPrice),
        country: getTableColumns(country),
        food: {
          id: food.id,
          name: food.name,
        },
        inflationRate: sql<number | null>`
          CASE
            WHEN prev.close IS NOT NULL AND prev.close != 0
            THEN ROUND(((${foodPrice.close} - prev.close) / prev.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflationRate"),
      })
      .from(foodPrice)
      .leftJoin(country, eq(foodPrice.countryId, country.id))
      .leftJoin(food, eq(foodPrice.foodId, food.id))
      .leftJoin(createdBy, eq(foodPrice.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(foodPrice.updatedById, updatedBy.id))
      .leftJoin(
        prevYear,
        and(
          eq(sql`prev.country_id`, foodPrice.countryId),
          eq(sql`prev.food_id`, foodPrice.foodId),
          eq(sql`prev.month`, foodPrice.month),
          eq(sql`CAST(prev.year AS INTEGER)`, sql`CAST(${foodPrice.year} AS INTEGER) - 1`)
        )
      )
      .where(and(...filters))
      .orderBy(asc(foodPrice.year), asc(foodPrice.foodId), asc(foodPrice.month));

    // ✅ Apply filters before executing the query
    if (countryId) {
      filters.push(eq(foodPrice.countryId, countryId));
    }
    if (foodId) {
      filters.push(eq(foodPrice.foodId, foodId));
    }
    if (year) {
      filters.push(eq(foodPrice.year, year));
    }
    if (month) {
      filters.push(eq(foodPrice.month, month));
    }
    if (date) {
      filters.push(eq(foodPrice.date, new Date(date)));
    }

    // ✅ Execute query AFTER applying filters
    const response = await query;

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodPriceByID(id: string) {
  try {
    const response = await db.select().from(foodPrice).where(eq(foodPrice.id, id)).limit(1);

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createFoodPrice(data: typeof foodPrice.$inferInsert) {
  try {
    const response = await db.insert(foodPrice).values(data).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createBulkFoodPrices(data: (typeof foodPrice.$inferInsert)[]) {
  try {
    const response = await db.transaction(async (tx) => {
      return await tx
        .insert(foodPrice)
        .values(data)
        .onConflictDoUpdate({
          target: [foodPrice.countryId, foodPrice.foodId, foodPrice.year, foodPrice.month],
          set: {
            open: sql`EXCLUDED.open`,
            low: sql`EXCLUDED.low`,
            high: sql`EXCLUDED.high`,
            close: sql`EXCLUDED.close`,
            date: sql`EXCLUDED.date`,
            updatedById: sql`EXCLUDED.updated_by_id`,
            updatedAt: sql`now()`,
          },
        })
        .returning();
    });

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function updateFoodPriceByID(id: string, data: typeof foodPrice.$inferInsert) {
  try {
    const response = await db.update(foodPrice).set(data).where(eq(foodPrice.id, id)).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodPriceByID(id: string) {
  try {
    const response = await db.delete(foodPrice).where(eq(foodPrice.id, id)).returning({ id: foodPrice.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodPricesByID(ids: string[]) {
  try {
    const response = await db.delete(foodPrice).where(inArray(foodPrice.id, ids)).returning({ ids: foodPrice.id });

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
