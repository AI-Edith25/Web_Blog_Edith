import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "studio_passcode";

export function proxy(request: NextRequest) {
  const passcode = process.env.STUDIO_PASSCODE;
  if (!passcode) {
    return NextResponse.next();
  }

  if (request.cookies.get(COOKIE_NAME)?.value === passcode) {
    return NextResponse.next();
  }

  const url = new URL("/studio-lock", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/studio/:path*",
};
