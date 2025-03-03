import { relations } from "drizzle-orm";
import { date, integer, pgTable, real, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  iso3Code: varchar("iso_3_code", { length: 3 }).notNull().unique(),
  currency: varchar("currency", { length: 3 }).notNull(),
  geojsonUrl: text("geojson_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const countryRelations = relations(countriesTable, ({ many }) => ({
  foodPrices: many(foodPricesTable),
  foodPriceIndexes: many(foodPriceIndexesTable),
}));

export const foodsTable = pgTable("foods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const foodRelations = relations(foodsTable, ({ many }) => ({
  foodPrices: many(foodPricesTable),
}));

export const foodPricesTable = pgTable(
  "food_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    open: real("open"),
    low: real("low"),
    high: real("high"),
    close: real("close"),
    date: date("date", { mode: "date" }),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    countryId: uuid("country_id")
      .references(() => countriesTable.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    foodId: uuid("food_id")
      .references(() => foodsTable.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique("year_month_country_food").on(table.year, table.month, table.countryId, table.foodId)]
);

export const foodPriceRelations = relations(foodPricesTable, ({ one }) => ({
  country: one(countriesTable, {
    fields: [foodPricesTable.countryId],
    references: [countriesTable.id],
  }),
  food: one(foodsTable, {
    fields: [foodPricesTable.foodId],
    references: [foodsTable.id],
  }),
}));

export const foodPriceIndexesTable = pgTable(
  "food_price_indexes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    open: real("open"),
    low: real("low"),
    high: real("high"),
    close: real("close"),
    date: date("date", { mode: "date" }),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    countryId: uuid("country_id")
      .references(() => countriesTable.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique("year_month_country").on(table.year, table.month, table.countryId)]
);

export const foodPriceIndexRelations = relations(foodPriceIndexesTable, ({ one }) => ({
  country: one(countriesTable, {
    fields: [foodPriceIndexesTable.countryId],
    references: [countriesTable.id],
  }),
}));
