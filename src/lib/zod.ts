import { z } from "zod";

export const CountrySchema = z.object({
  name: z.string().max(50),
  iso3Code: z.string().min(3).max(3),
  currency: z.string().min(3).max(3),
  geojsonUrl: z.string().url().optional(),
});

export const FoodSchema = z.object({
  name: z.string().max(50),
  description: z.string().optional(),
});

export const FoodPriceSchema = z.object({
  countryId: z.string().uuid(),
  foodId: z.string().uuid(),
  open: z.number().optional(),
  low: z.number().optional(),
  high: z.number().optional(),
  close: z.number().optional(),
  date: z.date(),
  year: z.number(),
  month: z.number(),
});

export const FoodPriceIndexSchema = z.object({
  countryId: z.string().uuid(),
  open: z.number().optional(),
  low: z.number().optional(),
  high: z.number().optional(),
  close: z.number().optional(),
  date: z.date(),
  year: z.number(),
  month: z.number(),
});
