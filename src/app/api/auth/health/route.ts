import { NextResponse } from "next/server";

function isConfigured(value: string | undefined) {
  return Boolean(value?.trim());
}

export function GET() {
  const mongoConfigured = isConfigured(
    process.env.MONGODB_URL || process.env.MONGODB_URI,
  );
  const databaseMode =
    process.env.NODE_ENV === "production"
      ? mongoConfigured
        ? "configured"
        : "missing"
      : "memory";
  const googleConfigured = Boolean(
    isConfigured(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_ID) &&
      isConfigured(process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET),
  );
  const githubConfigured = Boolean(
    isConfigured(process.env.GITHUB_CLIENT_ID) &&
      isConfigured(process.env.GITHUB_CLIENT_SECRET),
  );

  return NextResponse.json({
    ok: Boolean(process.env.BETTER_AUTH_SECRET),
    database: databaseMode,
    providers: {
      google: googleConfigured,
      github: githubConfigured,
    },
    appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    betterAuthUrl: Boolean(process.env.BETTER_AUTH_URL),
  });
}
