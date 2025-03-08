import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  countryCode: varchar("country_code", { length: 3 }).unique().notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
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
  name: varchar("name", { length: 255 }).notNull(),
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
    date: date("date", { mode: "date" }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    foodId: uuid("food_id").references(() => foodsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    countryId: uuid("country_id").references(() => countriesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    unique("year_month_food_country").on(
      t.year,
      t.month,
      t.foodId,
      t.countryId
    ),
  ]
);

export const foodPriceRelations = relations(foodPricesTable, ({ one }) => ({
  food: one(foodsTable, {
    fields: [foodPricesTable.foodId],
    references: [foodsTable.id],
  }),
  country: one(countriesTable, {
    fields: [foodPricesTable.countryId],
    references: [countriesTable.id],
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
    date: date("date", { mode: "date" }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    countryId: uuid("country_id").references(() => countriesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique("year_month_country").on(t.year, t.month, t.countryId)]
);

export const foodPriceIndexRelations = relations(
  foodPriceIndexesTable,
  ({ one }) => ({
    country: one(countriesTable, {
      fields: [foodPriceIndexesTable.countryId],
      references: [countriesTable.id],
    }),
  })
);
