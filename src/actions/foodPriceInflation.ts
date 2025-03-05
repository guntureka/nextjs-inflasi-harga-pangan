"use server";

import { db } from "@/db";
import { country, foodPriceInflation, user } from "@/db/schema";
import { aliasedTable, and, asc, eq, getTableColumns, inArray, SQL, sql } from "drizzle-orm";

export async function getFoodPriceInflations() {
  try {
    const response = await db.select().from(foodPriceInflation);

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodPriceInflationsWithUser() {
  try {
    const createdBy = aliasedTable(user, "createdBy");
    const updatedBy = aliasedTable(user, "updatedBy");

    const prevYear = db
      .select({
        countryId: foodPriceInflation.countryId,
        close: foodPriceInflation.close,
        year: foodPriceInflation.year,
        month: foodPriceInflation.month,
      })
      .from(foodPriceInflation)
      .as("prev");

    const response = await db
      .select({
        ...getTableColumns(foodPriceInflation),
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
            THEN ROUND(((${foodPriceInflation.close} - prev.close) / prev.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflationRate"),
      })
      .from(foodPriceInflation)
      .leftJoin(country, eq(foodPriceInflation.countryId, country.id))
      .leftJoin(createdBy, eq(foodPriceInflation.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(foodPriceInflation.updatedById, updatedBy.id))
      .leftJoin(
        prevYear,
        and(
          eq(sql`prev.country_id`, foodPriceInflation.countryId),
          eq(sql`prev.month`, foodPriceInflation.month),
          eq(sql`CAST(prev.year AS INTEGER)`, sql`CAST(${foodPriceInflation.year} AS INTEGER) - 1`)
        )
      )
      .orderBy(asc(country.name));

    // const response = await db.select().from(foodPriceInflation);

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodPriceInflationsWithParams({
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
        countryId: foodPriceInflation.countryId,
        close: foodPriceInflation.close,
        year: foodPriceInflation.year,
        month: foodPriceInflation.month,
      })
      .from(foodPriceInflation)
      .as("prev");

    let query = db
      .select({
        ...getTableColumns(foodPriceInflation),
        country: getTableColumns(country),
        inflationRate: sql<number | null>`
          CASE
            WHEN prev.close IS NOT NULL AND prev.close != 0
            THEN ROUND(((${foodPriceInflation.close} - prev.close) / prev.close * 100)::numeric, 2)
            ELSE NULL
          END
        `.as("inflationRate"),
      })
      .from(foodPriceInflation)
      .leftJoin(country, eq(foodPriceInflation.countryId, country.id))
      .leftJoin(createdBy, eq(foodPriceInflation.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(foodPriceInflation.updatedById, updatedBy.id))
      .leftJoin(
        prevYear,
        and(
          eq(sql`prev.country_id`, foodPriceInflation.countryId),
          eq(sql`prev.month`, foodPriceInflation.month),
          eq(sql`CAST(prev.year AS INTEGER)`, sql`CAST(${foodPriceInflation.year} AS INTEGER) - 1`)
        )
      )
      .orderBy(asc(foodPriceInflation.year), asc(foodPriceInflation.month));

    // ✅ Apply filters before executing the query
    if (countryId) {
      filters.push(eq(foodPriceInflation.countryId, countryId));
    }

    if (year) {
      filters.push(eq(foodPriceInflation.year, year));
    }
    if (month) {
      filters.push(eq(foodPriceInflation.month, month));
    }
    if (date) {
      filters.push(eq(foodPriceInflation.date, new Date(date)));
    }
    // ✅ Execute query AFTER applying filters
    const response = await query.where(and(...filters));

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getFoodPriceInflationByID(id: string) {
  try {
    const response = await db.select().from(foodPriceInflation).where(eq(foodPriceInflation.id, id)).limit(1);

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createFoodPriceInflation(data: typeof foodPriceInflation.$inferInsert) {
  try {
    const response = await db.insert(foodPriceInflation).values(data).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createBulkFoodPriceInflation(data: (typeof foodPriceInflation.$inferInsert)[]) {
  try {
    const response = await db.transaction(async (tx) => {
      return await tx
        .insert(foodPriceInflation)
        .values(data)
        .onConflictDoUpdate({
          target: [foodPriceInflation.countryId, foodPriceInflation.year, foodPriceInflation.month],
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

export async function updateFoodPriceInflationByID(id: string, data: typeof foodPriceInflation.$inferInsert) {
  try {
    const response = await db.update(foodPriceInflation).set(data).where(eq(foodPriceInflation.id, id)).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodPriceInflationByID(id: string) {
  try {
    const response = await db
      .delete(foodPriceInflation)
      .where(eq(foodPriceInflation.id, id))
      .returning({ id: foodPriceInflation.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteFoodPriceInflationsByID(ids: string[]) {
  try {
    const response = await db
      .delete(foodPriceInflation)
      .where(inArray(foodPriceInflation.id, ids))
      .returning({ ids: foodPriceInflation.id });

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
