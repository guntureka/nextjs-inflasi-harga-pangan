import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid, varchar, real, date, unique } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  image: text("image"),
  role: text("role").default("guest"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof user.$inferSelect;

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  createdCountries: many(country, {
    relationName: "country_created_by_id",
  }),
  updatedCountries: many(country, {
    relationName: "country_updated_by_id",
  }),
  createdFoods: many(food, {
    relationName: "food_created_by_id",
  }),
  updatedFoods: many(food, {
    relationName: "food_updated_by_id",
  }),
  createdFoodPrices: many(foodPrice, {
    relationName: "food_price_created_by_id",
  }),
  updatedFoodPrices: many(foodPrice, {
    relationName: "food_price_updated_by_id",
  }),
  createdFoodPriceInflations: many(foodPriceInflation, {
    relationName: "food_price_inflation_created_by_id",
  }),
  updatedFoodPriceInflations: many(foodPriceInflation, {
    relationName: "food_price_inflation_updated_by_id",
  }),
}));

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const country = pgTable("country", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  currency: varchar("currency", { length: 10 }).notNull(),
  geojson: text("geojson"),
  createdById: uuid("created_by_id").references(() => user.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  updatedById: uuid("updated_by_id").references(() => user.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const countryRelations = relations(country, ({ many, one }) => ({
  foodPrices: many(foodPrice),
  foodPriceInflations: many(foodPriceInflation),
  createdBy: one(user, {
    fields: [country.createdById],
    references: [user.id],
    relationName: "country_created_by_id",
  }),
  updatedBy: one(user, {
    fields: [country.updatedById],
    references: [user.id],
    relationName: "country_updated_by_id",
  }),
}));

export const food = pgTable("food", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdById: uuid("created_by_id").references(() => user.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  updatedById: uuid("updated_by_id").references(() => user.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const foodRelations = relations(food, ({ one }) => ({
  createdBy: one(user, {
    fields: [food.createdById],
    references: [user.id],
    relationName: "food_created_by_id",
  }),
  updatedBy: one(user, {
    fields: [food.updatedById],
    references: [user.id],
    relationName: "food_updated_by_id",
  }),
}));

export const foodPrice = pgTable(
  "food_price",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    open: real("open"),
    low: real("low"),
    high: real("high"),
    close: real("close"),
    date: date("date", { mode: "date" }),
    year: varchar("year", { length: 4 }).notNull(),
    month: varchar("month", { length: 2 }).notNull(),
    countryId: uuid("country_id")
      .notNull()
      .references(() => country.id, { onDelete: "cascade", onUpdate: "cascade" }),
    foodId: uuid("food_id")
      .notNull()
      .references(() => food.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdById: uuid("created_by_id").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    updatedById: uuid("updated_by_id").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique("country_food_year_month_unique").on(table.countryId, table.foodId, table.year, table.month)]
);

export const foodPriceRelations = relations(foodPrice, ({ one }) => ({
  country: one(country, {
    fields: [foodPrice.countryId],
    references: [country.id],
  }),
  food: one(food, {
    fields: [foodPrice.foodId],
    references: [food.id],
  }),
  createdBy: one(user, {
    fields: [foodPrice.createdById],
    references: [user.id],
    relationName: "food_price_created_by_id",
  }),
  updatedBy: one(user, {
    fields: [foodPrice.updatedById],
    references: [user.id],
    relationName: "food_price_updated_by_id",
  }),
}));

export const foodPriceInflation = pgTable(
  "food_price_inflation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    open: real("open"),
    low: real("low"),
    high: real("high"),
    close: real("close"),
    date: date("date", { mode: "date" }),
    year: varchar("year", { length: 4 }).notNull(),
    month: varchar("month", { length: 2 }).notNull(),
    countryId: uuid("country_id")
      .notNull()
      .references(() => country.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdById: uuid("created_by_id").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    updatedById: uuid("updated_by_id").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique("country_year_month_unique").on(table.countryId, table.year, table.month)]
);

export const foodPriceInflationRelations = relations(foodPriceInflation, ({ one }) => ({
  country: one(country, {
    fields: [foodPriceInflation.countryId],
    references: [country.id],
  }),
  createdBy: one(user, {
    fields: [foodPriceInflation.createdById],
    references: [user.id],
    relationName: "food_price_inflation_created_by_id",
  }),
  updatedBy: one(user, {
    fields: [foodPriceInflation.updatedById],
    references: [user.id],
    relationName: "food_price_inflation_updated_by_id",
  }),
}));
