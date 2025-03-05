import { z } from "zod";

const nameSchema = () => z.string({ required_error: "Name is required" });

const emailSchema = () => z.string({ required_error: "Email is required" }).email("Invalid email");

const phoneNumberSchema = () =>
  z
    .string({ required_error: "Phone number is required" })
    .refine((phoneNumber) => !phoneNumber || /^\+?[1-9]\d{1,14}$/.test(phoneNumber), {
      message: "Invalid phone number format",
    });

const passwordSchema = (errorMessage?: { required_error: string; length_error: string }) =>
  z.string({ required_error: errorMessage?.required_error ?? "Password is required" }).refine((password) => {
    if (password) {
      return password.length >= 8;
    }
    return true;
  }, errorMessage?.length_error ?? "Password must be atleast 8 characters");

const fileSchema = () =>
  z.instanceof(File).refine((file) => {
    if (file) {
      return file.size <= 10 * 1024 * 1024;
    }

    return true;
  }, "Image size must lest than 10mb");

const FloatSchema = () =>
  z
    .string()
    .optional()
    .refine(
      (val) => !val || /^-?[0-9]+(\.\d+)?$/.test(val),
      "Format angka tidak valid. Jangan gunakan koma, gunakan hanya angka, contoh: 10000000 atau 10000000.50"
    );

export const SignInSchema = z.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const SignUpSchema = z
  .object({
    name: nameSchema(),
    email: emailSchema(),
    password: passwordSchema(),
    confirmPassword: passwordSchema({
      required_error: "Confirm password must be atleast 8 characters",
      length_error: "Confirm password must be atleast 8 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const CreateUserSchema = z
  .object({
    // image: z
    //   .instanceof(File)
    //   .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
    //     message: "Only JPG, PNG, and WEBP images are allowed",
    //   })
    //   .refine((file) => file.size <= 5 * 1024 * 1024, {
    //     // Max 5MB
    //     message: "Image size must be less than 5MB",
    //   })
    //   .optional(),
    image: fileSchema().optional(),
    name: nameSchema(),
    email: emailSchema(),
    phoneNumber: phoneNumberSchema().optional(),
    password: passwordSchema(),
    confirmPassword: passwordSchema({
      required_error: "Confirm password must be atleast 8 characters",
      length_error: "Confirm password must be atleast 8 characters",
    }),
    role: z.enum(["guest", "contributor", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserSchema = z
  .object({
    image: fileSchema().optional(),
    name: nameSchema(),
    email: emailSchema(),
    phoneNumber: phoneNumberSchema().optional(),
    password: passwordSchema(),
    confirmPassword: passwordSchema({
      required_error: "Confirm password must be atleast 8 characters",
      length_error: "Confirm password must be atleast 8 characters",
    }),
    role: z.enum(["guest", "contributor", "admin"]).optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }

      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const CreateCountrySchema = z.object({
  name: nameSchema(),
  code: z
    .string({ required_error: "Code is required" })
    .min(3, "Country code is Required")
    .max(3, "Country Name must be less than 3 characters"),
  currency: z
    .string({ required_error: "Code is required" })
    .min(3, "Country code is Required")
    .max(3, "Country Name must be less than 3 characters"),
  geojson: fileSchema().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const UpdateCountrySchema = z.object({
  name: nameSchema(),
  code: z
    .string({ required_error: "Code is required" })
    .min(3, "Country code is Required")
    .max(3, "Country Name must be less than 3 characters"),
  currency: z
    .string({ required_error: "Code is required" })
    .min(3, "Country code is Required")
    .max(3, "Country Name must be less than 3 characters"),
  geojson: fileSchema().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const FoodSchema = z.object({
  name: nameSchema(),
  description: z.string().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const FoodPriceSchema = z.object({
  open: FloatSchema(),
  low: FloatSchema(),
  high: FloatSchema(),
  close: FloatSchema(),
  date: z.date().optional(),
  year: z.string({ required_error: "Year is required" }).max(4).min(4),
  month: z.string({ required_error: "Month is required" }).max(2).min(1),
  foodId: z.string({ required_error: "Food is required" }),
  countryId: z.string({ required_error: "Country is required" }),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const FoodPriceInflationSchema = z.object({
  open: FloatSchema(),
  low: FloatSchema(),
  high: FloatSchema(),
  close: FloatSchema(),
  date: z.date().optional(),
  year: z.string({ required_error: "Year is required" }).max(4).min(4),
  month: z.string({ required_error: "Month is required" }).max(2).min(1),
  countryId: z.string({ required_error: "Country is required" }),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const ImportSchema = z.object({
  file: fileSchema().refine(
    (file) => file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    {
      message: "Hanya file Excel (.xlsx) yang diperbolehkan",
    }
  ),
  foodId: z.string({ required_error: "Food is required" }).optional(),
  countryId: z.string({ required_error: "Country is required" }).optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});

export const ImportDataSchema = z.object({
  // date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  date: z.date(),
  year: z.string().optional(),
  month: z.string().optional(),
  open: z.number().optional(),
  low: z.number().optional(),
  high: z.number().optional(),
  close: z.number().optional(),
  countryId: z.string().optional(),
  foodId: z.string().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
});
