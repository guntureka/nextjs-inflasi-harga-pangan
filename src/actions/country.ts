"use server";

import { db } from "@/db";
import { country, foodPrice, foodPriceInflation, user } from "@/db/schema";
import { aliasedTable, asc, eq, getTableColumns, inArray } from "drizzle-orm";

export async function getCountries() {
  try {
    const response = await db.select().from(country).orderBy(asc(country.name));

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getCountriesWithFoodPriceInflations() {
  try {
    const response = await db
      .select({
        ...getTableColumns(country),
        foodPriceInflations: getTableColumns(foodPriceInflation),
      })
      .from(country)
      .leftJoin(foodPriceInflation, eq(country.id, foodPriceInflation.countryId));

    const result = Object.values(
      response.reduce<
        Record<
          string,
          typeof country.$inferSelect & {
            foodPriceInflations: (typeof foodPriceInflation.$inferSelect)[];
          }
        >
      >((acc, row) => {
        const countryData = row;
        const foodPriceInflation = row.foodPriceInflations;

        if (!acc[row.id]) {
          acc[row.id] = { ...countryData, foodPriceInflations: [] };
        }

        if (foodPriceInflation) {
          acc[row.id].foodPriceInflations.push(foodPriceInflation);
        }

        return acc;
      }, {})
    );

    return result;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getCountriesWithUser() {
  try {
    const createdBy = aliasedTable(user, "createdBy");
    const updatedBy = aliasedTable(user, "updatedBy");

    const response = await db
      .select({
        ...getTableColumns(country),
        createdBy: {
          id: createdBy.id,
          name: createdBy.name,
        },
        updatedBy: {
          id: updatedBy.id,
          name: updatedBy.name,
        },
      })
      .from(country)
      .leftJoin(createdBy, eq(country.createdById, createdBy.id))
      .leftJoin(updatedBy, eq(country.updatedById, updatedBy.id))
      .orderBy(asc(country.name));

    return response;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getCountryByID(id: string) {
  try {
    const response = await db.select().from(country).where(eq(country.id, id)).limit(1);

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function createCountry(data: typeof country.$inferInsert) {
  try {
    const response = await db.insert(country).values(data).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function updateCountryByID(id: string, data: typeof country.$inferInsert) {
  try {
    const response = await db.update(country).set(data).where(eq(country.id, id)).returning();

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteCountryByID(id: string) {
  try {
    const response = await db.delete(country).where(eq(country.id, id)).returning({ id: country.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function deleteCountriesByID(ids: string[]) {
  try {
    const response = await db.delete(country).where(inArray(country.id, ids)).returning({ ids: country.id });

    return response[0];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
