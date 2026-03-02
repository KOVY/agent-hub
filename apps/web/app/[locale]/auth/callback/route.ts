import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // OAuth callback handler — will be connected to Supabase Auth
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/en/dashboard";
  return NextResponse.redirect(redirectUrl);
}
