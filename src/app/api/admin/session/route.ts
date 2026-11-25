import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function GET() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = verifyAdminSessionToken(token);

  return NextResponse.json({
    authenticated,
    githubConfigured: Boolean(process.env.GITHUB_TOKEN),
    repo: process.env.GITHUB_REPO || "vadlyvldr/MY-CV-PORTFOLIO",
    branch: process.env.GITHUB_BRANCH || "main",
    devMode: process.env.NODE_ENV === "development",
    needsPinSetup: process.env.NODE_ENV === "production" && !process.env.ADMIN_PIN,
  });
}
