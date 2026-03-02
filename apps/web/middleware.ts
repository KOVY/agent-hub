import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run i18n middleware first (handles locale detection + redirects)
  const response = intlMiddleware(request);

  // 2. Refresh Supabase auth session (reads/writes cookies on response)
  const { user } = await updateSession(request, response);

  // 3. Protect dashboard routes — redirect to login if not authenticated
  const pathname = request.nextUrl.pathname;
  const isDashboard = /^\/[a-z]{2}\/dashboard/.test(pathname);

  if (isDashboard && !user) {
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If logged in user visits login page, redirect to dashboard
  const isLoginPage = /^\/[a-z]{2}\/auth\/login/.test(pathname);
  if (isLoginPage && user) {
    const locale = pathname.split("/")[1] || "en";
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
