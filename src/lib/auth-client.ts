import { adminClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  plugins: [
    adminClient(),
    customSessionClient<typeof auth>(),
  ]
})

export type Session = typeof authClient.$Infer.Session;
