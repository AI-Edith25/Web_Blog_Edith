import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "studio_passcode";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  const passcode = process.env.STUDIO_PASSCODE;
  if (!passcode) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.passcode !== "string" || body.passcode !== passcode) {
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, passcode, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
