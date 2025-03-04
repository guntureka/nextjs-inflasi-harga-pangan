"use server";

import { db } from "@/db";
import { countriesTable } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

export async function getCountries() {
  try {
    const res = await db.select().from(countriesTable);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCountryById(id: string) {
  try {
    const res = await db.select().from(countriesTable).where(eq(countriesTable.id, id)).limit(1);

    return res[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createCountry(data: typeof countriesTable.$inferInsert) {
  try {
    const res = await db.insert(countriesTable).values(data).returning({ id: countriesTable.id });

    return res[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createCountries(datas: (typeof countriesTable.$inferInsert)[]) {
  try {
    const res = await db
      .insert(countriesTable)
      .values(datas)
      .onConflictDoUpdate({
        target: [countriesTable.code],
        set: {
          name: sql`excluded.name`,
          geojsonUrl: sql`excluded.geojson_url`,
          currency: sql`excluded.currency`,
        },
      })
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateCountryById(id: string, datas: typeof countriesTable.$inferInsert) {
  try {
    const res = await db
      .update(countriesTable)
      .set(datas)
      .where(eq(countriesTable.id, id))
      .returning({ id: countriesTable.id });

    return res[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteCountryById(id: string) {
  try {
    const res = await db.delete(countriesTable).where(eq(countriesTable.id, id)).returning({ id: countriesTable.id });

    return res[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteCountriesById(ids: string[]) {
  try {
    const res = await db
      .delete(countriesTable)
      .where(inArray(countriesTable.id, ids))
      .returning({ id: countriesTable.id });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
