import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { admin, customSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

const options = {
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  plugins: [
    admin({
      defaultRole: false,
      adminRole: ["admin"],
    }),
  ],
  advanced: {
    generateId: false,
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...options.plugins,
    customSession(async ({ user, session }) => {
      return {
        user,
        session,
      };
    }, options),
    nextCookies(),
  ],
});
