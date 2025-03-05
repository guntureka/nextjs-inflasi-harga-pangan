import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

const authRoutes = ["/sign-in", "/sign-up"];
const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/dashboard/users"];

export default async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isAuthRoute = authRoutes.some((route) => pathName.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathName.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathName.startsWith(route));

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtectedRoute) {
    if (isAdminRoute && session?.user.role != "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
