import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminPin,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { pin?: string };
    const pin = typeof body?.pin === "string" ? body.pin : "";
    const check = verifyAdminPin(pin);

    if (!check.ok) {
      if (check.reason === "missing_server_pin") {
        return NextResponse.json(
          {
            ok: false,
            error:
              "ADMIN_PIN is not configured on the server yet. Set ADMIN_PIN in Vercel Environment Variables.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ ok: false, error: "Invalid PIN." }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json({
      ok: true,
      githubConfigured: Boolean(process.env.GITHUB_TOKEN),
      devMode: process.env.NODE_ENV === "development",
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
